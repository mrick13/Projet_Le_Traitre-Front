import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistoriquePartie {
  gameId: string;
  date: string;
  role: string | null;
  winner: 'village' | 'loups' | null;
  won: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private _user: any = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, { email, password });
  }

  register(email: string, password: string, pseudo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, { email, password, pseudo });
  }

  updatePseudo(userId: number, pseudo: string): Observable<{ id: number; pseudo: string }> {
    return this.http.patch<{ id: number; pseudo: string }>(`${this.apiUrl}/user/${userId}/pseudo`, { pseudo });
  }

  getHistorique(userId: number): Observable<{ historique: HistoriquePartie[] }> {
    return this.http.get<{ historique: HistoriquePartie[] }>(`${this.apiUrl}/user/${userId}/historique`);
  }

  setUser(user: any): void {
    this._user = user;
    // sessionStorage (et non localStorage) : chaque onglet garde sa propre session,
    // ce qui permet de tester plusieurs joueurs en ouvrant plusieurs onglets du même navigateur.
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    if (!this._user) {
      const user = sessionStorage.getItem('user');
      if (user) this._user = JSON.parse(user);
    }
    return this._user;
  }

  getUserId(): number | null {
    return this.getUser()?.id || null;
  }

  getUserPseudo(): string | null {
    return this.getUser()?.pseudo || null;
  }

  logout(): void {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this._user = null;
  }
}
