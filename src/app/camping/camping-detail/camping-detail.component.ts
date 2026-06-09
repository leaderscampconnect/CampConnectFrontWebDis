import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampingService, SiteCamping } from '../../services/camping.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-camping-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './camping-detail.component.html',
  styleUrl: './camping-detail.component.scss'
})
export class CampingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private campingService = inject(CampingService);
  readonly auth = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  readonly camping = signal<SiteCamping | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly bookingMessage = signal('');
  readonly submitting = signal(false);

  readonly bookingForm = this.formBuilder.nonNullable.group({
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    numberOfGuests: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCamping(Number(id));
    }
  }

  loadCamping(id: number): void {
    this.loading.set(true);
    this.campingService.getCampingById(id).subscribe({
      next: (data) => {
        this.camping.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load camping details.');
        this.loading.set(false);
      }
    });
  }

  book(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const userId = this.auth.userId();
    if (!userId) {
      void this.auth.login();
      return;
    }

    const camp = this.camping();
    if (!camp || !camp.idSite) return;

    this.submitting.set(true);
    this.bookingMessage.set('');
    this.error.set('');

    const formValue = this.bookingForm.getRawValue();

    this.campingService.bookCamping({
      siteId: camp.idSite,
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin,
      numberOfGuests: formValue.numberOfGuests
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.bookingMessage.set('Booking successful! Status: ' + res.statut);
        this.bookingForm.reset({ numberOfGuests: 1, dateDebut: '', dateFin: '' });
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || err.message || 'Booking failed.');
      }
    });
  }
}
