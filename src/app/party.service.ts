import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PartyService {
  // private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createParty(lobbyCode: string): Observable<{ gameId: string }> {
    return this.http.post<{ gameId: string }>('http://localhost:3000/partie/lobby', {
      id: lobbyCode,
    });
  }

  joinParty(partyId: string, userId: number) {
    return this.http.post(`http://localhost:3000/partie/${partyId}/join`, {
      userId
    });
  }

  getPlayers(partyId: string) {
    return this.http.get<{ joueurs: { id: number, pseudo: string }[] }>(`http://localhost:3000/partie/${partyId}/players`);
  }

}
