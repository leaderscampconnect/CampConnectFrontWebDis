import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CampingNavbarComponent } from '../../admin/camping-sites/camping-navbar/camping-navbar.component';
import { CampingService } from '../../../services/camping.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/auth.service';
import { CampingSite, SiteBooking } from '../../../models/camping-models';

@Component({
  selector: 'app-camping-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CampingNavbarComponent],
  templateUrl: './camping-owner-dashboard.component.html',
  styleUrl: './camping-owner-dashboard.component.scss'
})
export class CampingOwnerDashboardComponent implements OnInit {
  mySites: CampingSite[] = [];
  myBookings: SiteBooking[] = [];


  isLoading = false;
  errorMessage = '';

  constructor(
    private campingService: CampingService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const email = this.authService.email();
    if (!email) {
      this.errorMessage = 'User email not found.';
      this.isLoading = false;
      return;
    }

    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        if (!user.id) {
          this.errorMessage = 'User ID not found.';
          this.isLoading = false;
          return;
        }

        this.campingService.getMyCampingSites(user.id).subscribe({
          next: (sites: CampingSite[]) => {
            this.mySites = sites;

            const siteIds = sites.map(site => site.idSite).filter((id): id is number => id !== undefined);

            this.loadBookingsForSites(siteIds);
          },
          error: (error: any) => {
            console.error(error);
            this.errorMessage = 'Failed to load dashboard data.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load user profile.';
        this.isLoading = false;
      }
    });
  }

  loadBookingsForSites(siteIds: number[]): void {
    if (siteIds.length === 0) {
      this.myBookings = [];
      this.isLoading = false;
      return;
    }

    const bookingRequests = siteIds.map(id =>
      this.campingService.getDetailedBookingsBySite(id)
    );

    Promise.all(bookingRequests.map(req => req.toPromise()))
      .then((results: (SiteBooking[] | undefined)[]) => {
        this.myBookings = results
          .flat()
          .filter((booking): booking is SiteBooking => !!booking)
          .sort((a, b) => new Date(b.dateDebut || 0).getTime() - new Date(a.dateDebut || 0).getTime());

        this.isLoading = false;
      })
      .catch((error: any) => {
        console.error(error);
        this.errorMessage = 'Failed to load bookings.';
        this.isLoading = false;
      });
  }

  get totalSites(): number {
    return this.mySites.length;
  }

  get activeSites(): number {
    return this.mySites.filter(site => site.statutDispo === 'DISPONIBLE').length;
  }

  get closedSites(): number {
    return this.mySites.filter(site => site.statutDispo === 'FERME').length;
  }

  get totalBookings(): number {
    return this.myBookings.length;
  }

  get pendingBookings(): number {
    return this.myBookings.filter(booking => booking.statut === 'PENDING').length;
  }

  get confirmedBookings(): number {
    return this.myBookings.filter(booking => booking.statut === 'CONFIRMED').length;
  }

  get recentSites(): CampingSite[] {
    return this.mySites.slice(0, 3);
  }

  get recentBookings(): SiteBooking[] {
    return this.myBookings.slice(0, 5);
  }

}
