import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessage = '';

  constructor(
    readonly auth: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.authenticated()) {
      void this.router.navigateByUrl('/');
    }
  }

  async signIn(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.auth.login();
    } catch {
      this.errorMessage = 'Impossible de contacter Keycloak. Veuillez réessayer.';
      this.loading = false;
    }
  }
}
