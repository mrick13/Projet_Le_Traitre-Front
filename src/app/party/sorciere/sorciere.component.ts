import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemoService } from '../../demo.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-sorciere',
  templateUrl: './sorciere.component.html',
  styleUrl: './sorciere.component.scss',
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class SorciereComponent implements OnInit {
  isFlipped = false;
  isPowerFlipped = false;
  joueurs: { id: number; pseudo: string; etat: boolean }[] = [];
  joueurMortParLoups: any = null;
  potionVieUtilisee = false;
  potionMortUtilisee = false;
  cibleMort: any = null;

  constructor(private router: Router, private demoService: DemoService) {}

  ngOnInit(): void {
    this.joueurs = this.demoService.getJoueurs();
    // Ici tu dois déterminer quel joueur a été tué par les loups cette nuit.
    // Pour la démo, on prend le premier joueur mort (hors sorcière)
    this.joueurMortParLoups = this.joueurs.find(j => !j.etat && j.id !== this.getIdSorciere());
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
      this.demoService.ressusciterJoueur(this.joueurMortParLoups.id).subscribe({
        next: () => {
          this.joueurMortParLoups.etat = true; // <-- force update pour le template
        },
        error: (err) => {
          alert('Erreur lors de la résurrection : ' + err?.message || err);
        }
      });
    }
  }

  refuserResurection() {
    this.potionVieUtilisee = true;
  }

  choisirVictimeMort(joueur: any) {
    if (!this.potionMortUtilisee && joueur.etat && joueur.id !== this.getIdSorciere()) {
      this.cibleMort = joueur;
    }
  }

  validerPotionMort() {
    if (this.cibleMort && !this.potionMortUtilisee) {
      this.potionMortUtilisee = true;
      this.demoService.tuerJoueur(this.cibleMort.id).subscribe({
        next: () => {},
        error: (err) => {
          alert('Erreur lors de la validation : ' + err?.message || err);
        }
      });
    }
  }

  getIdSorciere() {
    // Pour l'exemple la sorcière a l'id 6
    return 6;
  }

  goToNext() {
    this.router.navigate(['/day']);
  }
}
