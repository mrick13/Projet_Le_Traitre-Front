import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {DemoService} from '../../demo.service';
import {SocketService} from '../../socket.service';
import { Subscription } from 'rxjs';
import { RolesInfoComponent } from '../roles-info/roles-info.component';

@Component({
  selector: 'app-voyante',
  templateUrl: './voyante.component.html',
  styleUrl: './voyante.component.scss',
  imports: [
    NgForOf,
    NgIf,
    RolesInfoComponent
  ],
  standalone: true
})
export class VoyanteComponent implements OnInit, OnDestroy {
  isFlipped = false;
  isPowerFlipped = false
  showRolesInfo = false;
  powerFlippedOnce = false;
  joueurs: { id: number; pseudo: string; role?: string }[] = [];
  joueurChoisi: any = null;
  monId = 3; // id de la Voyante en mode démo

  private playersSub?: Subscription;

  // Multiplayer
  isMultiplayer = false;
  isActivePlayer = true;

  // Carte du joueur (pour écran d'attente)
  monRole = 'Voyante';
  roleImage = '/assets/voyante.png';
  roleDescription = '';
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
      this.isActivePlayer = this.socketService.playerRole === 'Voyante';
      this.monRole = this.socketService.playerRole || 'Villageois';
      this.roleImage = this.roleImages[this.monRole] || '/assets/villageois.png';

      this.playersSub = this.socketService.players$.subscribe(list => {
        this.joueurs = list.map(p => ({ id: p.userId, pseudo: p.pseudo }));
      });
    } else {
      this.joueurs = this.demoService.getJoueurs();
    }
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  flipPowerCard() {
    if (!this.powerFlippedOnce) {
      this.isPowerFlipped = true;
      this.powerFlippedOnce = true;
    }
  }

  revealRole(joueur: any) {
    if (this.joueurChoisi) return;

    if (this.isMultiplayer) {
      this.socketService.checkVoyanteRole(joueur.id).then(res => {
        joueur.role = res.role;
        this.joueurChoisi = joueur;
      }).catch(err => {
        alert('Erreur lors de la consultation du rôle : ' + err);
      });
    } else {
      this.joueurChoisi = joueur;
    }
  }

  flipWaitingCard() {
    this.isWaitingFlipped = !this.isWaitingFlipped;
  }

  goToNext() {
    this.router.navigate(['/loup-garou']);
  }
}
