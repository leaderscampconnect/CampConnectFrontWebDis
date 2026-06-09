import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CampingService, InscriptionSite } from '../../services/camping.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  private campingService = inject(CampingService);
  readonly auth = inject(AuthService);

  readonly bookings = signal<InscriptionSite[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const userId = this.auth.userId();
    if (!userId) {
      this.error.set('You must be logged in to view bookings.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.campingService.getMyBookings(userId).subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load your bookings.');
        this.loading.set(false);
      }
    });
  }
}
