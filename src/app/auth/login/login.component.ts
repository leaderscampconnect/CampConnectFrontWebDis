import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';

    // Simulation login (à remplacer par un vrai appel API auth)
    setTimeout(() => {
      if (this.email && this.password.length >= 6) {
        this.router.navigate(['/users']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    }, 800);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}