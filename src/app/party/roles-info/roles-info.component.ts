import { Component, EventEmitter, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

interface RoleInfo {
  nom: string;
  image: string;
  camp: string;
  description: string;
  pouvoirActif: boolean;
}

@Component({
  selector: 'app-roles-info',
  templateUrl: './roles-info.component.html',
  styleUrl: './roles-info.component.scss',
  imports: [NgForOf, NgIf],
  standalone: true
})
export class RolesInfoComponent {
  @Output() close = new EventEmitter<void>();

  roles: RoleInfo[] = [
    {
      nom: 'Villageois',
      image: '/assets/villageois.png',
      camp: 'Village',
      description: 'Vous devez gagner avec le Village. Vous n\'avez pas de pouvoir particulier.',
      pouvoirActif: true
    },
    {
      nom: 'Loup-Garou',
      image: '/assets/loup-garou.png',
      camp: 'Loups',
      description: 'Vous devez gagner avec les Loups. Chaque nuit, les loups votent ensemble et éliminent le joueur qui a le plus de votes parmi eux.',
      pouvoirActif: true
    },
    {
      nom: 'Voyante',
      image: '/assets/voyante.png',
      camp: 'Village',
      description: 'Vous devez gagner avec le Village. Chaque nuit, vous pouvez découvrir le rôle secret d\'un joueur de votre choix.',
      pouvoirActif: true
    },
    {
      nom: 'Sorciere',
      image: '/assets/sorciere.png',
      camp: 'Village',
      description: 'Vous devez gagner avec le Village. Vous avez une potion de vie (ressusciter la victime des loups) et une potion de mort (tuer un joueur de votre choix), chacune utilisable une seule fois pour toute la partie.',
      pouvoirActif: true
    },
    {
      nom: 'Chasseur',
      image: '/assets/Chasseur.png',
      camp: 'Village',
      description: 'Vous devez gagner avec le Village. Si vous mourez, vous emportez immédiatement un autre joueur de votre choix avec vous.',
      pouvoirActif: false
    },
    {
      nom: 'Petite-Fille',
      image: '/assets/Petite_fille.png',
      camp: 'Village',
      description: 'Vous devez gagner avec le Village. Vous pouvez espionner discrètement les Loups-Garous pendant leur tour, sans vous faire remarquer.',
      pouvoirActif: false
    },
    {
      nom: 'Cupidon',
      image: '/assets/Cupidon.png',
      camp: 'Village',
      description: 'Vous devez gagner avec le Village. En début de partie, vous liez deux joueurs par l\'amour ; si les deux amoureux sont les derniers survivants, ils gagnent ensemble.',
      pouvoirActif: false
    }
  ];

  fermer(): void {
    this.close.emit();
  }
}
