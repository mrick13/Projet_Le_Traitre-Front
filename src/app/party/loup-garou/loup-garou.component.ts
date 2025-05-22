import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loup-garou',
  imports: [],
  templateUrl: './loup-garou.component.html',
  styleUrl: './loup-garou.component.scss'
})
export class LoupGarouComponent {
  constructor(private router: Router) {
  }
  isFlipped = false;

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  goToNext() {
    this.router.navigate(['/sorciere']);
  }
}
