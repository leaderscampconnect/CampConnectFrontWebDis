import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CampingService } from '../../../services/camping.service';;
import { SiteBooking } from '../../../models/camping-models';
import { CampingNavbarComponent } from '../camping-sites/camping-navbar/camping-navbar.component';;

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

  constructor(private campingService: CampingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  
getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || payload.authorities?.[0]?.replace('ROLE_', '');
  } catch {
    return null;
  }
}

loadBookings(): void {
  const role = this.getUserRole();

  if (role === 'GUIDE') {
    this.campingService.getMyCampBookingList().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  } else {
    this.campingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
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
