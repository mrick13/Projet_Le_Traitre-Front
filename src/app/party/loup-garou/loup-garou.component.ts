import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemoService } from '../../demo.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-loup-garou',
  templateUrl: './loup-garou.component.html',
  styleUrl: './loup-garou.component.scss',
  imports: [NgForOf, NgIf],
  standalone: true
})
export class LoupGarouComponent implements OnInit {
  isFlipped = false;
  isPowerFlipped = false;
  powerValidated = false;
  joueurs: { id: number; pseudo: string; etat?: boolean; role?: string }[] = [];
  joueurCible: any = null;
  loups: { id: number; pseudo: string }[] = [];
  monId = 4;

  constructor(private router: Router, private demoService: DemoService) {}

  ngOnInit(): void {
    this.joueurs = this.demoService.getJoueurs();
    // Trouve tous les loups-garous sauf moi-même
    this.loups = this.joueurs
      .filter(j => j.role === 'Loup-Garou' && j.id !== this.monId)
      .map(j => ({ id: j.id, pseudo: j.pseudo }));
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

  goToNext() {
    this.router.navigate(['/sorciere']);
  }
}
