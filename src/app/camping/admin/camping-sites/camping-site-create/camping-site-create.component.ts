import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CampingService } from '../../../../services/camping.service';;
import { CampingNavbarComponent } from '../camping-navbar/camping-navbar.component';
import { CampingSiteCreatePayload } from '../../../../models/camping-models';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/auth.service';

@Component({
  selector: 'app-camping-site-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CampingNavbarComponent],
  templateUrl: './camping-site-create.component.html',
  styleUrl: './camping-site-create.component.scss'
})
export class CampingSiteCreateComponent {
  constructor(
    private campingService: CampingService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  selectedFile: File | null = null;

  site: CampingSiteCreatePayload = {
    nom: '',
    localisation: '',
    capacite: 1,
    prixParNuit: 0,
    description: '',
    statutDispo: 'AVAILABLE'
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please select an image.', 'error');
      return;
    }

    const email = this.authService.email();
    if (!email) {
      Swal.fire('Error', 'User email not found in session.', 'error');
      return;
    }

    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        if (!user.id) {
          Swal.fire('Error', 'User ID not found.', 'error');
          return;
        }

        const formData = new FormData();
        formData.append('nom', this.site.nom);
        formData.append('localisation', this.site.localisation);
        formData.append('capacite', this.site.capacite.toString());
        formData.append('prixParNuit', this.site.prixParNuit.toString());
        formData.append('description', this.site.description);
        formData.append('statutDispo', this.site.statutDispo);
        formData.append('image', this.selectedFile as Blob);
        formData.append('ownerId', user.id.toString());
        formData.append('ownerEmail', user.email);

        this.campingService.addCampingSite(formData).subscribe({
          next: () => {
            Swal.fire('Success', 'Camping site added successfully.', 'success');
            this.router.navigate(['/admin/camping-sites']);
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire(
              'Error',
              error?.error?.message || 'Failed to add camping site.',
              'error'
            );
          }
        });
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        Swal.fire('Error', 'Failed to verify user account.', 'error');
      }
    });
  }
}
