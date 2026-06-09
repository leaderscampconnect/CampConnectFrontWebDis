import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    if (!this.email) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
        // Rediriger vers reset-password après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { email: this.email }
          });
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Email introuvable';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}