import { Component , OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  standalone: false,
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent implements OnInit {

  lobbyCode: string = '';
  roles = [
    { name: 'Villageois', count: 0 },
    { name: 'Loup-Garou', count: 0 },
    { name: 'Sorciere', count: 0 },
    { name: 'Voyante', count: 0 },
    { name: 'Petite-Fille', count: 0},
    { name: 'Chasseur', count: 0 },
    { name: 'Cupidon', count: 0 }
  ];
  players: (string | null)[] = Array(20).fill(null); // slots vides

  ngOnInit() {
    this.lobbyCode = this.generateCode();
  }

  generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  copyCode() {
    navigator.clipboard.writeText(this.lobbyCode);
    alert('Code copié !');
  }

  increment(role: any) {
    role.count++;
  }

  decrement(role: any) {
    if (role.count > 0) role.count--;
  }

  startGame() {
    console.log('Game started with config:', this.roles);
  }
}
