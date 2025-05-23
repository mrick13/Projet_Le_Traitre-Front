import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DemoService} from '../../demo.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-demo',
  imports: [
    NgForOf
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit {
  players: { id: number; pseudo: string; role: string; etat: boolean }[] = [];

  constructor(
    private demoService: DemoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.demoService.createDemoParty().subscribe({
      next: (res) => {
        console.log('🎯 Démo créée avec succès');
        this.players = res.joueurs;
      },
      error: (err) => console.error('Erreur création démo :', err)
    });
    console.log(this.demoService.createDemoParty());
  }

  goToParty(): void {
    this.router.navigate(['/day']);
  }
}
