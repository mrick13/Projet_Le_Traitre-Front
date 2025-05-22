import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { PartyService } from '../../party.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  gameCode: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private partyService: PartyService,
    private authService: AuthService,
  ) {}

  joinGame() {
    if (!this.gameCode.trim()) {
      this.toastr.error('Veuillez entrer un code de partie.');
      return;
    }

    const code = this.gameCode.toUpperCase();
    const userId = this.authService.getUserId();

    if(userId) {this.partyService.joinParty(code, userId).subscribe({
      next: () => {
        this.toastr.success(`Rejoint la partie ${code}`);
        this.router.navigate(['/lobby-loading', code]);
      },
      error: () => {
        this.toastr.error(`Partie ${code} introuvable.`);
      }
    });} else {
      this.toastr.error('problème , pas de user ID');
    }
  }
}
