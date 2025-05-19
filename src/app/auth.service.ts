import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  setUser(user: any): void {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    if (!this._user) {
      const user = localStorage.getItem('user');
      console.log(localStorage.getItem('user'));
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this._user = null;
  }
}
