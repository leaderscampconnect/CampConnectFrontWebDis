import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CampingService } from '../../../../services/camping.service';;
import { CampingSite } from '../../../../models/camping-models';;
import { CampingNavbarComponent } from '../camping-navbar/camping-navbar.component';
import { AuthService } from '../../../../core/auth.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-camping-site-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CampingNavbarComponent],
  templateUrl: './camping-site-list.component.html',
  styleUrl: './camping-site-list.component.scss'
})
export class CampingSiteListComponent implements OnInit {
  sites: CampingSite[] = [];
  isLoading = false;
  errorMessage = '';
  userRole: string | null = null;
  pageTitle = 'Camping Sites List';
  pageDescription = 'View, edit and manage camping destinations from the platform.';

  constructor(
    private campingService: CampingService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  isGuide(): boolean {
    return this.authService.roles()[0] === 'GUIDE';
  }
  ngOnInit(): void {
    this.userRole = this.authService.roles()[0];
    this.loadSitesByRole();
  }

  loadSitesByRole(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.userRole === 'GUIDE') {
      this.pageTitle = 'My Camping Sites';
      this.pageDescription = 'View and manage the camping sites you created.';

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
            next: (data) => {
              this.sites = data.reverse();
              this.isLoading = false;
            },
            error: (error) => {
              this.errorMessage = 'Failed to load your camping sites.';
              this.isLoading = false;
              console.error(error);
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to load user profile.';
          this.isLoading = false;
        }
      });

      return;
    }

    this.pageTitle = 'Camping Sites List';
    this.pageDescription = 'View, edit and manage camping destinations from the platform.';

    this.campingService.getAllCampingSites().subscribe({
      next: (data) => {
        this.sites = data.reverse();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load camping sites.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  closeSite(idSite: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This camping site will be closed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, close it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campingService.closeCampingSite(idSite).subscribe({
          next: () => {
            Swal.fire('Closed!', 'Camping site closed successfully.', 'success');
            this.loadSitesByRole();
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'Failed to close camping site.', 'error');
          }
        });
      }
    });
  }
}
