import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/auth.service';

import { CampingSite } from '../../../models/camping-models';;
import { SiteBooking } from '../../../models/camping-models';;
import { CampingService } from '../../../services/camping.service';;

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.scss'
})
export class BookingSummaryComponent implements OnInit {
  selectedSite?: CampingSite;
  bookingData?: SiteBooking;
  totalPrice = 0;
  nights = 0;

  constructor(
    private router: Router,
    private campingService: CampingService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const state = history.state;

    if (state?.bookingData && state?.selectedSite) {
      this.bookingData = state.bookingData;
      this.selectedSite = state.selectedSite;
      this.totalPrice = state.totalPrice || 0;
      this.nights = state.nights || 0;
    } else {
      this.router.navigate(['/camper/campings']);
    }
  }

confirmPayment(): void {
  if (!this.bookingData) return;

  if (!this.authService.authenticated()) {
    this.authService.login();
    return;
  }

  const email = this.authService.email();
  if (!email) {
    Swal.fire('Error', 'Your account is missing an email address.', 'error');
    return;
  }

  this.userService.getUserByEmail(email).subscribe({
    next: (user) => {
      if (!user.id) {
        Swal.fire('Error', 'User ID not found in database.', 'error');
        return;
      }

      this.bookingData!.utilisateurId = user.id;
      this.bookingData!.utilisateurEmail = email;

      this.campingService.createBooking(this.bookingData!).subscribe({
        next: (res) => {
          window.location.href = res.checkoutUrl || '';
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'Something went wrong while starting the payment.',
            confirmButtonColor: '#96952f',
            background: '#f5f5f3',
            color: '#172b44'
          });
        }
      });
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch user profile.', 'error');
    }
  });
}

  goBack(): void {
    this.router.navigate(['/camper/campings', this.selectedSite?.idSite]);
  }
}
