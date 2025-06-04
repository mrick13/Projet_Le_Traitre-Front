import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  private baseUrl = 'http://localhost:3000/partie';
  private joueursDemo: { id: number, pseudo: string, etat: boolean, role: string }[] = [];
  public jourActuel = 1;

  constructor(private http: HttpClient) {}

  resetJour() {
    this.jourActuel = 1;
  }

  incrementerJour() {
    this.jourActuel++;
  }

  getJourActuel() {
    return this.jourActuel;
  }

  createDemoParty(): Observable<{ gameId: string, joueurs: any[] }> {
    const partyId = 'DEMO1234';
    return this.http.post(`${this.baseUrl}/demo`, {}).pipe(
      switchMap((res: any) => {
        const roles = JSON.parse(res.partie.roles);
        return this.http.get<{ joueurs: { id: number, pseudo: string, etat: boolean }[] }>(`${this.baseUrl}/${partyId}/players`).pipe(
          map((joueurRes) => {
            this.joueursDemo = joueurRes.joueurs.map(joueur => ({
              id: joueur.id,
              pseudo: joueur.pseudo,
              etat: joueur.etat = true,
              role: roles.find((r: any) => r.joueurId === joueur.id)?.role || 'Inconnu'
            }));
            return {
              gameId: partyId ,
              joueurs : this.joueursDemo,
            };
          })
        );
      })
    );
  }

  getJoueurs() {
    return this.joueursDemo;
  }

  tuerJoueur(joueurId: number): Observable<any> {
    // Update côté back
    return this.http.patch(`${this.baseUrl}/demo/joueur/${joueurId}`, { etat: false }).pipe(
      map((res) => {
        // Update côté front (cache local)
        const joueur = this.joueursDemo.find(j => j.id === joueurId);
        if (joueur) joueur.etat = false;
        return res;
      })
    );
  }

  ressusciterJoueur(joueurId: number): Observable<any> {
    // Update côté back
    return this.http.patch(`${this.baseUrl}/demo/joueur/${joueurId}`, { etat: true }).pipe(
      map((res) => {
        // Update côté front (cache local)
        const joueur = this.joueursDemo.find(j => j.id === joueurId);
        if (joueur) joueur.etat = true;
        return res;
      })
    );
  }
}
