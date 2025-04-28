import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Importer ToastrService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router ,
    private toastr: ToastrService) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password, pseudo } = form.value;

      this.authService.register(email, password, pseudo).subscribe(
        response => {
          console.log('Inscription réussie', response);
          this.toastr.success('Votre compte a été créé avec succès !', 'Succès')
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Erreur lors de l’inscription', error);
          this.toastr.error('Une erreur est survenue lors de l’inscription.', 'Erreur');
        }
      );
    }
  }
}
