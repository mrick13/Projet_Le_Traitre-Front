import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { SocketService, GameOverInfo } from '../../socket.service';

@Component({
  selector: 'app-game-master',
  templateUrl: './game-master.component.html',
  styleUrl: './game-master.component.scss',
  imports: [NgIf, NgForOf],
  standalone: true
})
export class GameMasterComponent implements OnInit, OnDestroy {
  currentPhase = 'lobby';
  dayNumber = 0;
  players: { userId: number; pseudo: string; alive: boolean }[] = [];
  historique: { userId: number; pseudo: string; action: string; targetId: number; phase: string; dayNumber: number }[] = [];
  roles: Record<number, string> = {};
  gameOver: GameOverInfo | null = null;

  private phaseSub!: Subscription;
  private playersSub!: Subscription;
  private actionSub!: Subscription;
  private rolesSub!: Subscription;
  private gameOverSub!: Subscription;

  phases = ['day', 'voyante', 'loup-garou', 'sorciere'];

  constructor(private router: Router, private socketService: SocketService) {}

  ngOnInit(): void {
    if (!this.socketService.partyId) {
      this.router.navigate(['/home']);
      return;
    }

    this.phaseSub = this.socketService.phase$.subscribe(state => {
      this.currentPhase = state.phase;
      this.dayNumber = state.dayNumber;
    });

    this.playersSub = this.socketService.players$.subscribe(players => {
      this.players = players;
    });

    // Historique complet des actions de toute la partie (non vidé entre les phases)
    this.actionSub = this.socketService.actionReceived$.subscribe(action => {
      this.historique.push({ ...action, phase: this.currentPhase, dayNumber: this.dayNumber });
    });

    this.rolesSub = this.socketService.rolesDistributed$.subscribe(players => {
      this.roles = {};
      players.forEach(p => { this.roles[p.userId] = p.playerRole; });
    });

    this.gameOverSub = this.socketService.gameOver$.subscribe(data => {
      this.gameOver = data;
    });
    if (this.socketService.lastGameOver) {
      this.gameOver = this.socketService.lastGameOver;
    }
  }

  ngOnDestroy(): void {
    this.phaseSub?.unsubscribe();
    this.playersSub?.unsubscribe();
    this.actionSub?.unsubscribe();
    this.rolesSub?.unsubscribe();
    this.gameOverSub?.unsubscribe();
  }

  getWinnerLabel(): string {
    if (this.gameOver?.winner === 'village') return 'Le Village a gagné !';
    if (this.gameOver?.winner === 'loups') return 'Les Loups-Garous ont gagné !';
    return 'Partie terminée';
  }

  startGame(): void {
    this.socketService.changePhase('day');
  }

  nextPhase(): void {
    const currentIndex = this.phases.indexOf(this.currentPhase);
    if (currentIndex === -1 || currentIndex === this.phases.length - 1) {
      // Revenir au jour (nouveau cycle)
      this.socketService.changePhase('day');
    } else {
      this.socketService.changePhase(this.phases[currentIndex + 1]);
    }
  }

  goToPhase(phase: string): void {
    this.socketService.changePhase(phase);
  }

  endGame(): void {
    this.socketService.changePhase('end');
  }

  quitGame(): void {
    this.socketService.disconnect();
    this.router.navigate(['/home']);
  }

  getPhaseName(phase: string): string {
    const names: Record<string, string> = {
      'lobby': 'Lobby',
      'day': 'Jour',
      'voyante': 'Voyante',
      'loup-garou': 'Loup-Garou',
      'sorciere': 'Sorciere',
      'end': 'Fin'
    };
    return names[phase] || phase;
  }

  getPseudo(userId: number): string {
    return this.players.find(p => p.userId === userId)?.pseudo || `Joueur #${userId}`;
  }

  getRole(userId: number): string | null {
    return this.roles[userId] || null;
  }

  historiqueRecent() {
    return [...this.historique].reverse();
  }
}
