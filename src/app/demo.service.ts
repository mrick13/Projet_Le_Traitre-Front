import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  private baseUrl = 'http://localhost:3000/partie';

  constructor(private http: HttpClient) {}

  createDemoParty(): Observable<{ gameId: string, joueurs: any[] }> {
    const partyId = 'DEMO1234';
    return this.http.post(`${this.baseUrl}/demo`, {}).pipe(
      switchMap((res: any) => {
        const roles = JSON.parse(res.partie.roles);
        return this.http.get<{ joueurs: { id: number, pseudo: string, etat: boolean }[] }>(`${this.baseUrl}/${partyId}/players`).pipe(
          map((joueurRes) => {
            const joueurs = joueurRes.joueurs.map(joueur => ({
              id: joueur.id,
              pseudo: joueur.pseudo,
              etat: true,
              role: roles.find((r: any) => r.joueurId === joueur.id)?.role || 'Inconnu'
            }));
            console.table(joueurs)
            return { gameId: partyId, joueurs };
          })
        );
      })
    );
  }
}
