import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Correction du champ "styleUrl"
  standalone: false
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);

        sessionStorage.setItem('token', response.token);
        this.authService.setUser(response);

        this.router.navigate(['/home']);
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = 'Échec de la connexion. Vérifiez vos identifiants.';
      }
    );
  }
}
