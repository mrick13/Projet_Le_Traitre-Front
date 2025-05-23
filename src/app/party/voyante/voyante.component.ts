import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PartyService } from '../../party.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-voyante',
  templateUrl: './voyante.component.html',
  styleUrl: './voyante.component.scss',
  imports: [
    NgForOf
  ],
  standalone: true
})
export class VoyanteComponent implements OnInit {
  isFlipped = false;
  joueurs: { id: number; pseudo: string; role?: string }[] = [];
  joueurChoisi: any = null;

  constructor(private router: Router, private partyService: PartyService, private http: HttpClient) {}

  ngOnInit(): void {
    const partyId = 'DEMO1234';

    this.http.get<{ partie: { roles: string } }>(`http://localhost:3000/partie/DEMO1234`).subscribe({
      next: (res) => {
        const roles = JSON.parse(res.partie.roles);

        this.partyService.getPlayers(partyId).subscribe({
          next: (joueurRes) => {
            this.joueurs = joueurRes.joueurs.map(joueur => ({
              ...joueur,
              role: roles.find((r: any) => r.joueurId === joueur.id)?.role || 'Inconnu'
            }));
          },
          error: (e) => console.error('Erreur chargement joueurs', e)
        });
      },
      error: (err) => console.error('Erreur chargement roles', err)
    });
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  revealRole(joueur: any) {
    if (!this.joueurChoisi) {
      this.joueurChoisi = joueur;
    }
  }

  goToNext() {
    this.router.navigate(['/loup-garou']);
  }
}
