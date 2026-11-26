import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'loup-garou-front';

  constructor(
    private socketService: SocketService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.socketService.error$.subscribe(err => {
      this.toastr.error(err.message);
    });

    this.socketService.nightResolved$.subscribe(({ deaths }) => {
      if (deaths.length === 0) {
        this.toastr.info('Personne n\'est mort cette nuit.');
      } else {
        deaths.forEach(d => this.toastr.warning(`${d.pseudo} (${d.playerRole}) est mort cette nuit.`));
      }
    });

    this.socketService.voteResolved$.subscribe(({ eliminated, tie }) => {
      if (eliminated) {
        this.toastr.warning(`${eliminated.pseudo} (${eliminated.playerRole}) a été éliminé par le village.`);
      } else if (tie) {
        this.toastr.info('Égalité au second tour, personne n\'est éliminé.');
      }
    });

    this.socketService.voteTie$.subscribe(({ candidates }) => {
      const noms = candidates.map(c => c.pseudo).join(', ');
      this.toastr.info(`Égalité entre ${noms}, second tour de vote.`);
    });
  }
}
