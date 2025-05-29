import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {DemoService} from '../../demo.service';

@Component({
  selector: 'app-voyante',
  templateUrl: './voyante.component.html',
  styleUrl: './voyante.component.scss',
  imports: [
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class VoyanteComponent implements OnInit {
  isFlipped = false;
  isPowerFlipped = false
  powerFlippedOnce = false;
  joueurs: { id: number; pseudo: string; role?: string }[] = [];
  joueurChoisi: any = null;

  constructor(private router: Router, private demoService: DemoService) {}

  ngOnInit(): void {
    this.joueurs = this.demoService.getJoueurs();
    console.log(this.joueurs);
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  flipPowerCard() {
    if (!this.powerFlippedOnce) {
      this.isPowerFlipped = true;
      this.powerFlippedOnce = true;
    }
  }

  revealRole(joueur: any) {
    if (!this.joueurChoisi) {
      this.joueurChoisi = joueur;
    }
  }

  goToNext() {
    this.router.navigate(['/loup-garou']);
  }
}
