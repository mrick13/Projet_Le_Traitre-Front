import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DemoService } from '../../demo.service';
import { NgForOf, NgIf } from '@angular/common';
import { SocketService } from '../../socket.service';
import { Subscription } from 'rxjs';
import { RolesInfoComponent } from '../roles-info/roles-info.component';

@Component({
  selector: 'app-loup-garou',
  templateUrl: './loup-garou.component.html',
  styleUrl: './loup-garou.component.scss',
  imports: [NgForOf, NgIf, RolesInfoComponent],
  standalone: true
})
export class LoupGarouComponent implements OnInit, OnDestroy {
  isFlipped = false;
  isPowerFlipped = false;
  powerValidated = false;
  showRolesInfo = false;
  joueurs: { id: number; pseudo: string; etat?: boolean; role?: string }[] = [];
  joueurCible: any = null;
  loups: { id: number; pseudo: string }[] = [];
  monId = 4;

  private playersSub?: Subscription;
  private wolfTargetSub?: Subscription;

  // Multiplayer
  isMultiplayer = false;
  isActivePlayer = true;

  // Carte du joueur (pour écran d'attente)
  monRole = 'Loup-Garou';
  roleImage = '/assets/loup-garou.png';
  isWaitingFlipped = false;

  private roleImages: Record<string, string> = {
    'Villageois': '/assets/villageois.png',
    'Loup-Garou': '/assets/loup-garou.png',
    'Voyante': '/assets/voyante.png',
    'Sorciere': '/assets/sorciere.png',
    'Chasseur': '/assets/Chasseur.png',
    'Petite-Fille': '/assets/Petite_fille.png',
    'Cupidon': '/assets/Cupidon.png',
  };

  constructor(
    private router: Router,
    private demoService: DemoService,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    this.isMultiplayer = !!this.socketService.partyId;

    if (this.isMultiplayer) {
      this.monId = this.socketService.userId!;
      this.isActivePlayer = this.socketService.playerRole === 'Loup-Garou';
      this.monRole = this.socketService.playerRole || 'Villageois';
      this.roleImage = this.roleImages[this.monRole] || '/assets/villageois.png';
      this.loups = this.socketService.wolfTeammates.map(w => ({ id: w.userId, pseudo: w.pseudo }));

      this.playersSub = this.socketService.players$.subscribe(list => {
        this.joueurs = list.map(p => ({ id: p.userId, pseudo: p.pseudo, etat: p.alive }));
      });

      this.wolfTargetSub = this.socketService.wolfTargetUpdated$.subscribe(({ targetId }) => {
        this.joueurCible = this.joueurs.find(j => j.id === targetId) || null;
      });
    } else {
      this.joueurs = this.demoService.getJoueurs();
      this.loups = this.joueurs
        .filter(j => j.role === 'Loup-Garou' && j.id !== this.monId)
        .map(j => ({ id: j.id, pseudo: j.pseudo }));
    }
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
    this.wolfTargetSub?.unsubscribe();
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  flipPowerCard() {
    if (!this.isPowerFlipped) {
      this.isPowerFlipped = true;
    }
  }

  choisirVictime(joueur: any) {
    if (!this.powerValidated && joueur.id !== this.monId) {
      this.joueurCible = joueur;
    }
  }

  validerChoix() {
    if (this.joueurCible && !this.powerValidated) {
      this.powerValidated = true;
      if (this.isMultiplayer) {
        this.socketService.submitAction('loup-garou-kill', this.joueurCible.id);
      } else {
        this.demoService.tuerJoueur(this.joueurCible.id).subscribe({
          next: () => {
            alert('Vous avez tué un joueur')
          },
          error: (err) => {
            alert('Erreur lors de la validation : ' + err?.message || err);
          }
        });
      }
    }
  }

  flipWaitingCard() {
    this.isWaitingFlipped = !this.isWaitingFlipped;
  }

  goToNext() {
    this.router.navigate(['/sorciere']);
  }
}
