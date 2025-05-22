import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-voyante',
  imports: [],
  templateUrl: './voyante.component.html',
  styleUrl: './voyante.component.scss'
})
export class VoyanteComponent {
  constructor(private router: Router) {
  }
  isFlipped = false;

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  goToNext() {
    this.router.navigate(['/loup-garou']);
  }

}
