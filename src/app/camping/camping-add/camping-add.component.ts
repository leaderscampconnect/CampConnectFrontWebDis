import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampingService } from '../../services/camping.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-camping-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './camping-add.component.html',
  styleUrl: './camping-add.component.scss'
})
export class CampingAddComponent {
  private formBuilder = inject(FormBuilder);
  private campingService = inject(CampingService);
  private router = inject(Router);
  readonly auth = inject(AuthService);

  readonly submitting = signal(false);
  readonly error = signal('');
  readonly message = signal('');

  readonly campingForm = this.formBuilder.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(3)]],
    localisation: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    capacite: [10, [Validators.required, Validators.min(1)]],
    prixParNuit: [50, [Validators.required, Validators.min(0)]]
  });

  createCamping(): void {
    if (this.campingForm.invalid) {
      this.campingForm.markAllAsTouched();
      return;
    }

    if (!this.auth.hasAnyRole('SITE_OWNER', 'ADMIN')) {
      this.error.set('You do not have permission to add a camping site.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');
    this.message.set('');

    const formValue = this.campingForm.getRawValue();

    this.campingService.addCamping({
      ...formValue,
      statutDispo: 'DISPONIBLE'
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.message.set('Camping site successfully created!');
        setTimeout(() => this.router.navigate(['/campings']), 1500);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || err.message || 'Failed to create site.');
      }
    });
  }
}
