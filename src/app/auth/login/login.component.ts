import { Component } from '@angular/core';
import { AuthService} from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        // Rediriger vers une autre page ou effectuer une autre action
      },
      error => {
        console.error('Login failed', error);
        // Afficher un message d'erreur
      }
    );
  }
}
