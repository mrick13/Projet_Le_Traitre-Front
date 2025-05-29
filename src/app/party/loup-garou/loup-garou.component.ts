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
  joueurs: { id: number; pseudo: string; etat?: boolean }[] = [];
  joueurCible: any = null;

  constructor(private router: Router, private demoService: DemoService) {}

  ngOnInit(): void {
    this.joueurs = this.demoService.getJoueurs();
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
    if (!this.powerValidated && joueur.id !== 4) {
      this.joueurCible = joueur;
    }
  }

  validerChoix() {
    if (this.joueurCible && !this.powerValidated) {
      this.powerValidated = true;
      // Appel au service pour tuer le joueur côté back + front
      this.demoService.tuerJoueur(this.joueurCible.id).subscribe({
        next: () => {
          alert('Vous avez tué un joueur')
        },
        error: (err) => {
          // Gérer l'erreur si besoin
          alert('Erreur lors de la validation : ' + err?.message || err);
        }
      });
    }
  }

  goToNext() {
    this.router.navigate(['/sorciere']);
  }
}
