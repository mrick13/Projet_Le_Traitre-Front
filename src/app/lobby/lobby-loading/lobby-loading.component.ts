import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForOf } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../../socket.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-lobby-loading',
    imports: [
        NgForOf
    ],
  templateUrl: './lobby-loading.component.html',
  styleUrl: './lobby-loading.component.scss'
})
export class LobbyLoadingComponent implements OnInit, OnDestroy {

  players: (string | null)[] = Array(20).fill(null);
  private playersSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const partyId = this.route.snapshot.paramMap.get('id');
    const userId = this.authService.getUserId();
    const pseudo = this.authService.getUserPseudo();

    if (partyId && userId && pseudo) {
      this.socketService.joinGame(partyId, userId, pseudo, 'player');

      // S'abonner à la liste complète des joueurs (mise à jour à la connexion + à chaque arrivée)
      this.playersSub = this.socketService.players$.subscribe(playerList => {
        this.players = Array(20).fill(null);
        playerList.forEach((p, i) => {
          if (i < 20) {
            this.players[i] = p.pseudo;
          }
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
  }

  quitGame() {
    this.socketService.disconnect();
    this.router.navigate(['/home']);
  }

}
