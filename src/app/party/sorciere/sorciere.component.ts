import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sorciere',
  imports: [],
  templateUrl: './sorciere.component.html',
  styleUrl: './sorciere.component.scss'
})
export class SorciereComponent {
  constructor(private router: Router) {
  }
  isFlipped = false;

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  goToNext() {
    this.router.navigate(['/day']);
  }

}
