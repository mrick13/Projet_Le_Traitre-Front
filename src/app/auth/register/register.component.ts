import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password, pseudo } = form.value;

      this.authService.register(email, password, pseudo).subscribe(
        response => {
          console.log('Inscription réussie', response);
          alert('Votre compte a été créé avec succès !');
        },
        error => {
          console.error('Erreur lors de l’inscription', error);
          alert('Une erreur est survenue lors de l’inscription.');
        }
      );
    }
  }
}
