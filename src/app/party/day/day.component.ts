import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-day',
  imports: [],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss'
})
export class DayComponent {

  constructor(private router: Router) {
  }
  isFlipped = false;

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }
  goToNext() {
  this.router.navigate(['/voyante']);
  }
}
