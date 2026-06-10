import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CampingService } from '../../../services/camping.service';;
import { SiteBooking } from '../../../models/camping-models';
import { CampingNavbarComponent } from '../camping-sites/camping-navbar/camping-navbar.component';
import { AuthService } from '../../../core/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-site-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, CampingNavbarComponent],
  templateUrl: './site-bookings.component.html',
  styleUrl: './site-bookings.component.scss'
})
export class SiteBookingsComponent implements OnInit {
  bookings: SiteBooking[] = [];
  filteredBookings: SiteBooking[] = [];
  paginatedBookings: SiteBooking[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private campingService: CampingService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

loadBookings(): void {
  // Only ADMIN should ever call getAllBookings
  if (this.authService.hasAnyRole('ADMIN')) {
    this.campingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => {
        console.error('Failed to fetch all bookings:', error);
      }
    });
  } 
  // SITE_OWNER or GUIDE should see their own camp bookings
  else if (this.authService.hasAnyRole('SITE_OWNER', 'GUIDE')) {
    const email = this.authService.email();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          if (user.id) {
            this.campingService.getMyCampBookingList(user.id).subscribe({
              next: (data) => {
                this.bookings = data;
              },
              error: (error) => {
                console.error('Failed to fetch my camp bookings:', error);
              }
            });
          } else {
            console.error('User ID missing from internal database.');
          }
        },
        error: (error) => console.error('Failed to fetch user:', error)
      });
    } else {
      console.error("Owner email missing from token");
    }
  } 
  // Fallback for anyone else navigating here
  else {
    console.error("User does not have permission to view this bookings list. Current roles:", this.authService.roles());
  }
}

isGuide(): boolean {
  return this.authService.hasAnyRole('GUIDE');
}

isCancelable(booking: any): boolean {
  return booking.statut === 'EN_ATTENTE';
}

  cancelBooking(booking: SiteBooking): void {
    if (!booking.idInscription) {
      this.showError('Invalid booking ID.');
      return;
    }

    Swal.fire({
      title: 'Cancel Booking?',
      text: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      background: '#f5f5f3',
      color: '#172b44'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performCancellation(booking);
      }
    });
  }

  private performCancellation(booking: SiteBooking): void {
    if (!booking.idInscription) return;
    this.campingService.cancelBooking(booking.idInscription).subscribe({
      next: (updatedBooking: SiteBooking) => {
        booking.statut = updatedBooking.statut;

        Swal.fire({
          icon: 'success',
          title: 'Cancelled',
          text: 'Booking status changed to CANCELLED.',
          confirmButtonColor: '#96952f',
          background: '#f5f5f3',
          color: '#172b44',
          customClass: {
            popup: 'custom-swal-popup'
          }
        });
      },
      error: (error: unknown) => {
        console.error(error);

        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: 'Could not cancel booking.',
          confirmButtonColor: '#96952f',
          background: '#f5f5f3',
          color: '#172b44',
          customClass: {
            popup: 'custom-swal-popup'
          }
        });
      }
    });
  }
  private showError(msg: string): void {
    this.errorMessage = msg;
    // Swal error handling...
  }
}
