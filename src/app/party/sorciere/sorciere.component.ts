import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DemoService } from '../../demo.service';
import {NgForOf, NgIf} from '@angular/common';
import {SocketService} from '../../socket.service';
import { Subscription } from 'rxjs';
import { RolesInfoComponent } from '../roles-info/roles-info.component';

@Component({
  selector: 'app-sorciere',
  templateUrl: './sorciere.component.html',
  styleUrl: './sorciere.component.scss',
  imports: [
    NgIf,
    NgForOf,
    RolesInfoComponent
  ],
  standalone: true
})
export class SorciereComponent implements OnInit, OnDestroy {
  isFlipped = false;
  isPowerFlipped = false;
  showRolesInfo = false;
  joueurs: { id: number; pseudo: string; etat: boolean }[] = [];
  joueurMortParLoups: any = null;
  potionVieUtilisee = false;
  potionMortUtilisee = false;
  cibleMort: any = null;
  monId = 6; // id de la Sorcière en mode démo

  // Multiplayer
  isMultiplayer = false;
  isActivePlayer = true;

  // Carte du joueur (pour écran d'attente)
  monRole = 'Sorciere';
  roleImage = '/assets/sorciere.png';
  isWaitingFlipped = false;

  private playersSub?: Subscription;

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
      this.isActivePlayer = this.socketService.playerRole === 'Sorciere';
      this.monRole = this.socketService.playerRole || 'Villageois';
      this.roleImage = this.roleImages[this.monRole] || '/assets/villageois.png';

      this.playersSub = this.socketService.players$.subscribe(list => {
        this.joueurs = list.map(p => ({ id: p.userId, pseudo: p.pseudo, etat: p.alive }));
      });

      // Seule la vraie Sorcière a le droit d'interroger le contexte de la nuit
      if (this.isActivePlayer) {
        this.socketService.getSorciereContext().then(ctx => {
          this.joueurMortParLoups = ctx.wolfTarget ? { id: ctx.wolfTarget.userId, pseudo: ctx.wolfTarget.pseudo, etat: false } : null;
          this.potionVieUtilisee = ctx.healUsed;
          this.potionMortUtilisee = ctx.killUsed;
        }).catch(err => {
          alert('Erreur lors de la récupération du contexte : ' + err);
        });
      }
    } else {
      this.joueurs = this.demoService.getJoueurs();
      this.joueurMortParLoups = this.joueurs.find(j => !j.etat && j.id !== this.getIdSorciere());
    }
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  flipPowerCard() {
    if (!this.isPowerFlipped) {
      this.isPowerFlipped = true;
    }
  }

  resusciter() {
    if (this.joueurMortParLoups && !this.potionVieUtilisee) {
      this.potionVieUtilisee = true;
      if (this.isMultiplayer) {
        this.socketService.submitAction('sorciere-heal', this.joueurMortParLoups.id);
        this.joueurMortParLoups.etat = true;
      } else {
        this.demoService.ressusciterJoueur(this.joueurMortParLoups.id).subscribe({
          next: () => {
            this.joueurMortParLoups.etat = true;
          },
          error: (err) => {
            alert('Erreur lors de la résurrection : ' + err?.message || err);
          }
        });
      }
    }
  }

  refuserResurection() {
    this.potionVieUtilisee = true;
    // Le joueur visé par les loups va mourir : le griser dans la liste de la potion de mort
    if (this.joueurMortParLoups) {
      const cible = this.joueurs.find(j => j.id === this.joueurMortParLoups.id);
      if (cible) cible.etat = false;
    }
  }

  choisirVictimeMort(joueur: any) {
    if (!this.potionMortUtilisee && joueur.etat && joueur.id !== this.getIdSorciere()) {
      this.cibleMort = joueur;
    }
  }

  validerPotionMort() {
    if (this.cibleMort && !this.potionMortUtilisee) {
      this.potionMortUtilisee = true;
      if (this.isMultiplayer) {
        this.socketService.submitAction('sorciere-kill', this.cibleMort.id);
      } else {
        this.demoService.tuerJoueur(this.cibleMort.id).subscribe({
          next: () => {},
          error: (err) => {
            alert('Erreur lors de la validation : ' + err?.message || err);
          }
        });
      }
    }
  }

  getIdSorciere() {
    return this.monId;
  }

  flipWaitingCard() {
    this.isWaitingFlipped = !this.isWaitingFlipped;
  }

  goToNext() {
    this.router.navigate(['/day']);
  }
}
