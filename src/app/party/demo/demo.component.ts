import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DemoService} from '../../demo.service';
import {NgForOf} from '@angular/common';
import {PartyService} from '../../party.service';

@Component({
  selector: 'app-demo',
  imports: [
    NgForOf
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit {

  players: { id: number; pseudo: string; role: string }[] = [];

  constructor(
    private demoService: DemoService,
    private router: Router,
    private partyService: PartyService
  ) {}

  ngOnInit(): void {
    const partyId = 'DEMO1234';

    this.demoService.createDemoParty().subscribe({
      next: (res) => {
        console.log('🎯 Démo créée avec succès');

        const roles = JSON.parse(res.partie.roles);

        this.partyService.getPlayers(partyId).subscribe({
          next: (joueurRes) => {
            this.players = joueurRes.joueurs.map((joueur: any) => {
              const role = roles.find((r: any) => r.joueurId === joueur.id)?.role || 'Inconnu';
              return {
                id: joueur.id,
                pseudo: joueur.pseudo,
                role
              };
            });
          },
          error: () => console.error('Erreur récupération des joueurs')
        });
      },
      error: (err) => console.error('Erreur création démo :', err)
    });
  }

  goToParty(): void {
    this.router.navigate(['/day']);
  }
}
