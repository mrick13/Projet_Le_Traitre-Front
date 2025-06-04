import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DemoService} from '../../demo.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-day',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss'
})
export class DayComponent implements OnInit {

  isFlipped = false;
  jourActuel = 1;
  joueurs: { id: number, pseudo: string, etat: boolean, role: string }[] = [];
  mortsCetteNuit: { pseudo: string, role: string }[] = [];
  joueurVote: any = null;
  voteValide = false;

  constructor(private router: Router, private demoService: DemoService) {}

  ngOnInit(): void {
    this.jourActuel = this.demoService.getJourActuel();
    this.joueurs = this.demoService.getJoueurs();

    if (this.jourActuel > 1) {
      // On considère morts cette nuit : ceux qui sont passés de vivant à mort depuis la dernière nuit
      // Pour la démo, on prend tous les joueurs morts et on ignore les morts des jours précédents si tu veux.
      // Ici, on fait simple : on affiche tous les joueurs morts (à affiner si tu veux un historique précis !)
      this.mortsCetteNuit = this.joueurs
        .filter(j => !j.etat)
        .map(j => ({ pseudo: j.pseudo, role: j.role }));
    }
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  choisirVote(joueur: any) {
    if (!this.voteValide && joueur.etat) {
      this.joueurVote = joueur;
    }
  }

  validerVote() {
    if (this.joueurVote) {
      this.voteValide = true;
      this.demoService.tuerJoueur(this.joueurVote.id).subscribe({
        next: () => {
          // Met à jour l'état local pour affichage
          this.joueurVote.etat = false;
        },
        error: (err) => {
          alert("Erreur lors de l'élimination : " + err?.message || err);
        }
      });
    }
  }

  goToNext() {
    this.demoService.incrementerJour();
    // Va vers la prochaine phase (voyante, etc)
    this.router.navigate(['/voyante']);
  }

  finDemo() {
    alert('Merci d\'avoir testé la démo !');
    this.router.navigate(['/home']);
  }
}
