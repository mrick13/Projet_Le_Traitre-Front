import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-spectator',
  templateUrl: './spectator.component.html',
  styleUrl: './spectator.component.scss',
  imports: [NgForOf, NgIf],
  standalone: true
})
export class SpectatorComponent implements OnInit, OnDestroy {
  currentPhase = 'day';
  dayNumber = 0;
  roster: { userId: number; pseudo: string; playerRole: string; alive: boolean }[] = [];

  private phaseSub!: Subscription;
  private playersSub!: Subscription;

  constructor(private router: Router, private socketService: SocketService) {}

  ngOnInit(): void {
    if (!this.socketService.partyId) {
      this.router.navigate(['/home']);
      return;
    }

    this.phaseSub = this.socketService.phase$.subscribe(state => {
      this.currentPhase = state.phase;
      this.dayNumber = state.dayNumber;
    });

    this.refreshRoster();

    // Rafraîchir le rôle/statut des autres joueurs à chaque nouvelle mort
    this.playersSub = this.socketService.players$.subscribe(() => {
      this.refreshRoster();
    });
  }

  ngOnDestroy(): void {
    this.phaseSub?.unsubscribe();
    this.playersSub?.unsubscribe();
  }

  private refreshRoster(): void {
    this.socketService.getRoster().then(players => {
      this.roster = players;
    }).catch(() => {
      // Rien à afficher tant que la partie n'a pas commencé
    });
  }

  getPhaseName(phase: string): string {
    const names: Record<string, string> = {
      'lobby': 'Lobby',
      'day': 'Jour',
      'voyante': 'Voyante',
      'loup-garou': 'Loup-Garou',
      'sorciere': 'Sorciere',
      'end': 'Fin'
    };
    return names[phase] || phase;
  }

  quitGame(): void {
    this.socketService.disconnect();
    this.router.navigate(['/home']);
  }
}
