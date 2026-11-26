import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  createGame(): void {
    const gameId = this.generateCode();
    this.router.navigate(['/lobby', gameId]);
  }

  generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  joinGame(): void {
    this.router.navigate(['/search']);
  }
  getUserPseudo(): string | null {
    return this.authService.getUserPseudo()
  }
  goProfile(){
    this.router.navigate(['/profile']);
  }
}
