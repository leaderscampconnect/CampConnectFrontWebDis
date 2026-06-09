import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  user: User = { firstName: '', lastName: '', email: '', role: 'CAMPER' };
  isEditMode   = false;
  userId?:       number;
  errorMessage  = '';
  successMessage = '';
  submitting    = false;
  showPassword  = false;

  roles = ['CAMPER', 'SITE_OWNER', 'ORGANIZER'];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.userService.getUserById(this.userId).subscribe({
        next: (data) => this.user = { ...data, password: '' },
        error: () => this.errorMessage = 'Utilisateur introuvable'
      });
    }
  }

  onSubmit(): void {
    this.submitting = true;
    this.errorMessage = '';

    if (this.isEditMode && this.userId) {
      // Ne pas envoyer le mot de passe si vide en mode édition
      const payload = { ...this.user };
      if (!payload.password) delete payload.password;

      this.userService.updateUser(this.userId, payload).subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Profil mis à jour avec succès !';
          setTimeout(() => this.router.navigate(['/users']), 1500);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
        }
      });
    } else {
      this.userService.createUser(this.user).subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Compte créé avec succès !';
          setTimeout(() => this.router.navigate(['/users']), 1500);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'CAMPER':     '🏕 Campeur',
      'SITE_OWNER': '🏡 Propriétaire',
      'ORGANIZER':  '🎪 Organisateur'
    };
    return labels[role] ?? role;
  }

  getRoleDesc(role: string): string {
    const descs: Record<string, string> = {
      'CAMPER':     'Peut rechercher et réserver des sites de camping',
      'SITE_OWNER': 'Peut gérer et publier ses propres sites',
      'ORGANIZER':  'Peut créer et gérer des événements de camping'
    };
    return descs[role] ?? '';
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}