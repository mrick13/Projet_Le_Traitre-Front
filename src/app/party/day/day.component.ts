import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {DemoService} from '../../demo.service';
import {NgForOf, NgIf} from '@angular/common';
import {SocketService} from '../../socket.service';
import { Subscription } from 'rxjs';
import { RolesInfoComponent } from '../roles-info/roles-info.component';

@Component({
  selector: 'app-day',
  imports: [
    NgIf,
    NgForOf,
    RolesInfoComponent
  ],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss'
})
export class DayComponent implements OnInit, OnDestroy {

  isFlipped = false;
  showRolesInfo = false;
  jourActuel = 1;
  joueurs: { id: number, pseudo: string, etat: boolean, role: string }[] = [];
  mortsCetteNuit: { pseudo: string, role: string }[] = [];
  joueurVote: any = null;
  voteValide = false;
  voteRunoffCandidates: { userId: number; pseudo: string }[] | null = null;
  monId: number | null = null;

  // Multiplayer
  isMultiplayer = false;
  isActivePlayer = true; // En phase day, tout le monde participe au vote

  private playersSub?: Subscription;
  private voteTieSub?: Subscription;

  // Carte du joueur
  monRole = 'Villageois';
  roleImage = '/assets/villageois.png';
  roleDescription = 'Vous êtes Villageois<br>Vous devez gagner avec le Village<br>Vous n\'avez pas de pouvoir particulier.';

  private roleImages: Record<string, string> = {
    'Villageois': '/assets/villageois.png',
    'Loup-Garou': '/assets/loup-garou.png',
    'Voyante': '/assets/voyante.png',
    'Sorciere': '/assets/sorciere.png',
    'Chasseur': '/assets/Chasseur.png',
    'Petite-Fille': '/assets/Petite_fille.png',
    'Cupidon': '/assets/Cupidon.png',
  };

  private roleDescriptions: Record<string, string> = {
    'Villageois': 'Vous êtes Villageois<br>Vous devez gagner avec le Village<br>Vous n\'avez pas de pouvoir particulier.',
    'Loup-Garou': 'Vous êtes Loup-Garou<br>Vous devez gagner avec les Loups<br>Vous pouvez tuer un joueur chaque nuit.',
    'Voyante': 'Vous êtes Voyante<br>Vous devez gagner avec le Village<br>Vous pouvez voir le rôle d\'un joueur chaque nuit.',
    'Sorciere': 'Vous êtes Sorcière<br>Vous devez gagner avec le Village<br>Vous avez le pouvoir de ressusciter ou de tuer un joueur.',
    'Chasseur': 'Vous êtes Chasseur<br>Vous devez gagner avec le Village<br>Si vous mourez, vous emportez un joueur avec vous.',
    'Petite-Fille': 'Vous êtes Petite Fille<br>Vous devez gagner avec le Village<br>Vous pouvez espionner les loups-garous.',
    'Cupidon': 'Vous êtes Cupidon<br>Vous devez gagner avec le Village<br>Vous pouvez lier deux joueurs par l\'amour.',
  };

  constructor(
    private router: Router,
    private demoService: DemoService,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    this.isMultiplayer = !!this.socketService.partyId;

    if (this.isMultiplayer) {
      this.monId = this.socketService.userId;
      this.jourActuel = this.socketService.phase$.value.dayNumber;
      this.monRole = this.socketService.playerRole || 'Villageois';

      this.playersSub = this.socketService.players$.subscribe(list => {
        this.joueurs = list.map(p => ({ id: p.userId, pseudo: p.pseudo, etat: p.alive, role: '' }));
      });

      const historique: { pseudo: string, role: string }[] = [];
      const eliminePasLeVillage = this.socketService.lastVoteResult?.eliminated;
      if (eliminePasLeVillage) {
        historique.push({ pseudo: eliminePasLeVillage.pseudo, role: eliminePasLeVillage.playerRole });
      }
      historique.push(...this.socketService.lastNightDeaths.map(d => ({ pseudo: d.pseudo, role: d.playerRole })));
      this.mortsCetteNuit = historique;

      this.voteTieSub = this.socketService.voteTie$.subscribe(({ candidates }) => {
        this.voteRunoffCandidates = candidates;
        this.joueurVote = null;
        this.voteValide = false;
      });
    } else {
      this.jourActuel = this.demoService.getJourActuel();
      this.joueurs = this.demoService.getJoueurs();
    }

    // Configurer la carte selon le rôle
    this.roleImage = this.roleImages[this.monRole] || '/assets/villageois.png';
    this.roleDescription = this.roleDescriptions[this.monRole] || this.roleDescriptions['Villageois'];

    if (this.jourActuel > 1 && !this.isMultiplayer) {
      this.mortsCetteNuit = this.joueurs
        .filter(j => !j.etat)
        .map(j => ({ pseudo: j.pseudo, role: j.role }));
    }
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
    this.voteTieSub?.unsubscribe();
  }

  estCandidatRunoff(joueur: any): boolean {
    return !this.voteRunoffCandidates || this.voteRunoffCandidates.some(c => c.userId === joueur.id);
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  choisirVote(joueur: any) {
    if (!this.voteValide && joueur.etat && joueur.id !== this.monId && this.estCandidatRunoff(joueur)) {
      this.joueurVote = joueur;
    }
  }

  validerVote() {
    if (this.joueurVote) {
      this.voteValide = true;
      if (this.isMultiplayer) {
        this.socketService.submitAction('vote', this.joueurVote.id);
      } else {
        this.demoService.tuerJoueur(this.joueurVote.id).subscribe({
          next: () => {
            this.joueurVote.etat = false;
          },
          error: (err) => {
            alert("Erreur lors de l'élimination : " + err?.message || err);
          }
        });
      }
    }
  }

  goToNext() {
    this.demoService.incrementerJour();
    this.router.navigate(['/voyante']);
  }

  finDemo() {
    alert('Merci d\'avoir testé la démo !');
    this.router.navigate(['/home']);
  }
}
