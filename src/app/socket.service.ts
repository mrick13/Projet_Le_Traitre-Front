import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface PhaseState {
  phase: string;
  dayNumber: number;
}

export interface PlayerInfo {
  userId: number;
  pseudo: string;
  alive: boolean;
}

export interface DeathInfo {
  userId: number;
  pseudo: string;
  playerRole: string;
}

export interface GameOverInfo {
  winner: 'village' | 'loups' | null;
  players: { userId: number; pseudo: string; playerRole: string; alive: boolean }[];
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;

  partyId: string | null = null;
  role: 'master' | 'player' | null = null;
  playerRole: string | null = null;
  userId: number | null = null;
  pseudo: string | null = null;
  wolfTeammates: { userId: number; pseudo: string }[] = [];

  // Dernière valeur reçue, lisible de façon synchrone par un composant qui monte après l'événement
  lastNightDeaths: DeathInfo[] = [];
  lastVoteResult: { eliminated: DeathInfo | null; tie: boolean } | null = null;
  lastGameOver: GameOverInfo | null = null;

  phase$ = new BehaviorSubject<PhaseState>({ phase: 'lobby', dayNumber: 0 });
  playerJoined$ = new Subject<{ userId: number; pseudo: string }>();
  actionReceived$ = new Subject<{ userId: number; pseudo: string; action: string; targetId: number }>();
  roleAssigned$ = new Subject<{ playerRole: string }>();
  rolesDistributed$ = new Subject<{ userId: number; pseudo: string; playerRole: string }[]>();
  error$ = new Subject<{ message: string }>();
  players$ = new BehaviorSubject<PlayerInfo[]>([]);
  nightResolved$ = new Subject<{ deaths: DeathInfo[] }>();
  voteResolved$ = new Subject<{ eliminated: DeathInfo | null; tie: boolean }>();
  voteTie$ = new Subject<{ candidates: { userId: number; pseudo: string }[] }>();
  wolfTargetUpdated$ = new Subject<{ targetId: number | null; pseudo: string | null }>();
  gameOver$ = new Subject<GameOverInfo>();

  private readonly SERVER_URL = 'http://localhost:3000';

  // Mapping phase -> route pour les joueurs
  private phaseRoutes: Record<string, string> = {
    'lobby': '/lobby-loading',
    'day': '/day',
    'voyante': '/voyante',
    'loup-garou': '/loup-garou',
    'sorciere': '/sorciere',
    'end': '/end'
  };

  constructor(private router: Router) {}

  joinGame(partyId: string, userId: number, pseudo: string, role: 'master' | 'player', playerRole?: string): void {
    this.partyId = partyId;
    this.role = role;
    this.playerRole = playerRole || null;
    this.userId = userId;
    this.pseudo = pseudo;

    if (!this.socket) {
      this.socket = io(this.SERVER_URL);
      this.registerListeners();
    }

    this.socket.emit('game:join', { partyId, userId, pseudo, role, playerRole });
  }

  private registerListeners(): void {
    if (!this.socket) return;

    this.socket.on('game:joined', (data: { partyId: string; currentPhase: string; dayNumber: number; players: PlayerInfo[] }) => {
      this.phase$.next({ phase: data.currentPhase, dayNumber: data.dayNumber });
      this.players$.next(data.players);
    });

    this.socket.on('game:player-joined', (data: { userId: number; pseudo: string; alive: boolean }) => {
      this.playerJoined$.next(data);
      const current = this.players$.value;
      if (!current.find(p => p.userId === data.userId)) {
        this.players$.next([...current, data]);
      }
    });

    // Mise à jour de l'état vivant/mort des joueurs (après une nuit ou un vote)
    this.socket.on('game:players-updated', (data: { players: PlayerInfo[] }) => {
      this.players$.next(data.players);
    });

    // Résolution de la nuit : qui est mort (loups + potion de mort)
    this.socket.on('game:night-resolved', (data: { deaths: DeathInfo[] }) => {
      this.lastNightDeaths = data.deaths;
      this.nightResolved$.next(data);
    });

    // Résolution du vote de jour
    this.socket.on('game:vote-resolved', (data: { eliminated: DeathInfo | null; tie: boolean }) => {
      this.lastVoteResult = data;
      this.voteResolved$.next(data);
    });

    // Égalité au vote : second tour restreint à certains candidats
    this.socket.on('game:vote-tie', (data: { candidates: { userId: number; pseudo: string }[] }) => {
      this.voteTie$.next(data);
    });

    // Synchronisation de la cible des loups entre eux (majorité en cours, null si égalité)
    this.socket.on('game:wolf-target-updated', (data: { targetId: number | null; pseudo: string | null }) => {
      this.wolfTargetUpdated$.next(data);
    });

    // Fin de partie : camp gagnant + révélation de tous les rôles
    this.socket.on('game:over', (data: GameOverInfo) => {
      this.lastGameOver = data;
      this.gameOver$.next(data);
    });

    this.socket.on('phase:changed', (data: { phase: string; dayNumber: number }) => {
      this.phase$.next(data);

      // Navigation automatique pour les joueurs (pas le MJ)
      if (this.role === 'player') {
        // Un joueur mort part en mode spectateur plutôt que sur les écrans de pouvoir/vote
        if (data.phase !== 'end' && !this.isAlive()) {
          this.router.navigate(['/spectator']);
          return;
        }
        const route = this.phaseRoutes[data.phase];
        if (route) {
          this.router.navigate([route]);
        }
      }
    });

    this.socket.on('action:received', (data: any) => {
      this.actionReceived$.next(data);
    });

    // Le joueur reçoit son rôle assigné
    this.socket.on('game:role-assigned', (data: { playerRole: string; teammates?: { userId: number; pseudo: string }[] }) => {
      this.playerRole = data.playerRole;
      this.wolfTeammates = data.teammates || [];
      this.roleAssigned$.next(data);
    });

    // Le MJ reçoit la distribution complète des rôles
    this.socket.on('game:roles-distributed', (data: { players: { userId: number; pseudo: string; playerRole: string }[] }) => {
      this.rolesDistributed$.next(data.players);
    });

    this.socket.on('error', (data: { message: string }) => {
      this.error$.next(data);
    });
  }

  startGame(roles: { name: string; count: number }[]): void {
    if (this.socket && this.partyId) {
      this.socket.emit('game:start', { partyId: this.partyId, roles });
    }
  }

  changePhase(phase: string): void {
    if (this.socket && this.partyId) {
      this.socket.emit('phase:change', { partyId: this.partyId, phase });
    }
  }

  submitAction(action: string, targetId: number): void {
    if (this.socket && this.partyId) {
      this.socket.emit('action:submit', { partyId: this.partyId, action, targetId });
    }
  }

  // La voyante demande le rôle d'un joueur (réponse privée du serveur)
  checkVoyanteRole(targetId: number): Promise<{ targetId: number; role: string | null }> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.partyId) {
        reject('Non connecté');
        return;
      }
      this.socket.emit('voyante:check', { partyId: this.partyId, targetId }, (res: any) => {
        if (res?.error) reject(res.error); else resolve(res);
      });
    });
  }

  // La sorcière récupère la cible des loups et l'état de ses potions
  getSorciereContext(): Promise<{ wolfTarget: { userId: number; pseudo: string } | null; healUsed: boolean; killUsed: boolean }> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.partyId) {
        reject('Non connecté');
        return;
      }
      this.socket.emit('sorciere:get-context', { partyId: this.partyId }, (res: any) => {
        if (res?.error) reject(res.error); else resolve(res);
      });
    });
  }

  // Un joueur mort consulte la liste complète des joueurs avec leurs rôles
  getRoster(): Promise<{ userId: number; pseudo: string; playerRole: string; alive: boolean }[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.partyId) {
        reject('Non connecté');
        return;
      }
      this.socket.emit('game:get-roster', { partyId: this.partyId }, (res: any) => {
        if (res?.error) reject(res.error); else resolve(res.players);
      });
    });
  }

  isAlive(): boolean {
    if (this.userId === null) return true;
    return this.players$.value.find(p => p.userId === this.userId)?.alive ?? true;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.partyId = null;
    this.role = null;
    this.playerRole = null;
    this.userId = null;
    this.pseudo = null;
    this.wolfTeammates = [];
    this.lastNightDeaths = [];
    this.lastVoteResult = null;
    this.lastGameOver = null;
    this.phase$.next({ phase: 'lobby', dayNumber: 0 });
    this.players$.next([]);
  }
}
