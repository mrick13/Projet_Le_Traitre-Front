import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) {
  }

  createGame(): void {
    this.router.navigate(['/lobby']);
  }
  joinGame(): void {
    this.router.navigate(['/lobby']);
  }
}
