import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5432';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/connexion/login`, { email, password });
  }

  register(email: string, password: string, pseudo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/connexion/register`, { email, password, pseudo });
  }

}
