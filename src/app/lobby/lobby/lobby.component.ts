import { Component , OnInit, OnDestroy } from '@angular/core';
import { PartyService} from '../../party.service';
import { ToastrService } from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../../socket.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  standalone: false,
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent implements OnInit, OnDestroy {

  lobbyCode: string = '';
  private playersSub!: Subscription;
  roles = [
    { name: 'Villageois', count: 0 },
    { name: 'Loup-Garou', count: 0 },
    { name: 'Sorciere', count: 0 },
    { name: 'Voyante', count: 0 },
    { name: 'Petite-Fille', count: 0},
    { name: 'Chasseur', count: 0 },
    { name: 'Cupidon', count: 0 }
  ];
  players: (string | null)[] = Array(20).fill(null); // slots vides

  constructor(
    private route : ActivatedRoute,
    private partyService: PartyService,
    private router: Router,
    private toastr: ToastrService,
    private socketService: SocketService,
    private authService: AuthService,
    ){}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('id');

    if (!code) {
      this.toastr.error('Code de partie manquant.');
      this.router.navigate(['/home']);
      return;
    }

    this.lobbyCode = code;
    this.createLobbyBack();
  }

  createLobbyBack(): void {
    this.partyService.createParty(this.lobbyCode, this.authService.getUserId()).subscribe({
      next: (res) => {
        this.lobbyCode = res.gameId;
        this.toastr.success('Partie créée avec succès !', 'Succès');

        // Rejoindre la room socket en tant que MJ
        const userId = this.authService.getUserId();
        const pseudo = this.authService.getUserPseudo();
        if (userId && pseudo) {
          this.socketService.joinGame(this.lobbyCode, userId, pseudo, 'master');

          // S'abonner à la liste complète des joueurs
          this.playersSub = this.socketService.players$.subscribe(playerList => {
            this.players = Array(20).fill(null);
            playerList.forEach((p, i) => {
              if (i < 20) {
                this.players[i] = p.pseudo;
              }
            });
          });
        }
      },
      error: (err) => {
        console.error('Erreur création partie :', err);
        this.toastr.error('Impossible de créer la partie.', 'Erreur');
        this.router.navigate(['/home']);
      }
    });
  }

  copyCode() {
    navigator.clipboard.writeText(this.lobbyCode);
    alert('Code copié !');
  }

  increment(role: any) {
    role.count++;
  }

  decrement(role: any) {
    if (role.count > 0) role.count--;
  }

  startGame() {
    // Envoyer la config des rôles au serveur pour distribution
    this.socketService.startGame(this.roles);
    this.router.navigate(['/game-master']);
  }
  quitGame() {
    this.socketService.disconnect();
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
  }
}
