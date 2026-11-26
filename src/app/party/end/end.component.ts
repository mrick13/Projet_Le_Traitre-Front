import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService, GameOverInfo } from '../../socket.service';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  standalone: false,
  styleUrl: './end.component.scss'
})
export class EndComponent implements OnInit {
  winner: 'village' | 'loups' | null = null;
  roster: { userId: number; pseudo: string; playerRole: string; alive: boolean }[] = [];

  constructor(private router: Router, private socketService: SocketService) {}

  ngOnInit(): void {
    if (this.socketService.lastGameOver) {
      this.appliquerResultat(this.socketService.lastGameOver);
    } else if (this.socketService.partyId) {
      // Reconnexion tardive : pas encore reçu l'événement game:over, on va chercher le roster
      this.socketService.getRoster().then(players => {
        this.roster = players;
      }).catch(() => {});
    }
  }

  private appliquerResultat(data: GameOverInfo): void {
    this.winner = data.winner;
    this.roster = data.players;
  }

  getWinnerLabel(): string {
    if (this.winner === 'village') return 'Le Village a gagné !';
    if (this.winner === 'loups') return 'Les Loups-Garous ont gagné !';
    return 'Partie terminée';
  }

  retourAccueil(): void {
    this.socketService.disconnect();
    this.router.navigate(['/home']);
  }
}
