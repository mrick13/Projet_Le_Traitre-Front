import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {Router} from '@angular/router';

@Component({
  selector: 'app-lobby-loading',
    imports: [
        NgForOf
    ],
  templateUrl: './lobby-loading.component.html',
  styleUrl: './lobby-loading.component.scss'
})
export class LobbyLoadingComponent {

  constructor(private router: Router,) {
  }

  players: (string | null)[] = Array(20).fill(null); // slots vides

  quitGame() {
    this.router.navigate(['/home']);
  }

}
