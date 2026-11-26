import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, HistoriquePartie } from '../../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: false,
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  pseudo: string = '';
  nouveauPseudo: string = '';
  modeEdition = false;
  enCours = false;

  historique: HistoriquePartie[] = [];
  chargementHistorique = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.pseudo = this.authService.getUserPseudo() || '';

    this.authService.getHistorique(userId).subscribe({
      next: (res) => {
        this.historique = res.historique;
        this.chargementHistorique = false;
      },
      error: () => {
        this.chargementHistorique = false;
        this.toastr.error('Impossible de charger l\'historique des parties.');
      }
    });
  }

  get nombreParties(): number {
    return this.historique.length;
  }

  get nombreVictoires(): number {
    return this.historique.filter(h => h.won === true).length;
  }

  commencerEdition(): void {
    this.nouveauPseudo = this.pseudo;
    this.modeEdition = true;
  }

  annulerEdition(): void {
    this.modeEdition = false;
  }

  enregistrerPseudo(): void {
    const userId = this.authService.getUserId();
    const pseudo = this.nouveauPseudo.trim();

    if (!userId || !pseudo || pseudo === this.pseudo) {
      this.modeEdition = false;
      return;
    }

    this.enCours = true;
    this.authService.updatePseudo(userId, pseudo).subscribe({
      next: (res) => {
        this.pseudo = res.pseudo;
        this.authService.setUser({ ...this.authService.getUser(), pseudo: res.pseudo });
        this.modeEdition = false;
        this.enCours = false;
        this.toastr.success('Pseudo mis à jour.');
      },
      error: (err) => {
        this.enCours = false;
        if (err.status === 409) {
          this.toastr.error('Ce pseudo est déjà pris.');
        } else {
          this.toastr.error('Impossible de changer le pseudo.');
        }
      }
    });
  }

  getWinnerLabel(h: HistoriquePartie): string {
    if (h.winner === 'village') return 'Victoire du Village';
    if (h.winner === 'loups') return 'Victoire des Loups-Garous';
    return 'Interrompue';
  }

  retourAccueil(): void {
    this.router.navigate(['/home']);
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
