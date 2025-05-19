import { Component , OnInit } from '@angular/core';
import { PartyService} from '../../party.service';
import { ToastrService } from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  standalone: false,
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent implements OnInit {

  lobbyCode: string = '';
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
    this.partyService.createParty( this.lobbyCode).subscribe({
      next: (res) => {
        this.lobbyCode = res.gameId;
        this.toastr.success('Partie créée avec succès !', 'Succès');
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
    console.log('Game started with config:', this.roles);
  }
  quitGame() {
    this.router.navigate(['/home']);
  }

  refreshPlayers() {
    this.partyService.getPlayers(this.lobbyCode).subscribe({
      next: (res) => {
        console.log(`Joueurs connectés à la partie ${this.lobbyCode} :`, res.joueurs);
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des joueurs.');
      }
    });
  }
}
