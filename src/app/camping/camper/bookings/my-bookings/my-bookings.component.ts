import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CampingService } from '../../../../services/camping.service';
import { SiteBooking } from '../../../../models/camping-models';
import { AuthService } from '../../../../core/auth.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  private campingService = inject(CampingService);
  private userService = inject(UserService);
  readonly auth = inject(AuthService);

  readonly bookings = signal<SiteBooking[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const email = this.auth.email();
    if (!email) {
      this.error.set('You must be logged in to view bookings.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        if (!user.id) {
          this.error.set('User ID not found in database.');
          this.loading.set(false);
          return;
        }

        this.campingService.getMyBookings(user.id).subscribe({
          next: (data) => {
            this.bookings.set(data);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set('Failed to load your bookings.');
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        this.error.set('Failed to fetch user profile.');
        this.loading.set(false);
      }
    });
  }
}
