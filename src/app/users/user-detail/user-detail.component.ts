import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user: User | null = null;
  campSites: any[] = [];
  loading = true;
  loadingSites = false;
  errorMessage = '';
  activeTab: 'info' | 'sites' = 'info';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(+id).subscribe({
        next: (data) => {
          this.user = data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Utilisateur introuvable.';
          this.loading = false;
        }
      });
    }
  }

  loadCampSites(): void {
    this.activeTab = 'sites';
    if (this.campSites.length > 0) return;
    this.loadingSites = true;
    this.userService.getCampSites().subscribe({
      next: (data) => {
        this.campSites = data;
        this.loadingSites = false;
      },
      error: () => {
        this.campSites = [];
        this.loadingSites = false;
      }
    });
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'CAMPER': '🏕️ Campeur',
      'SITE_OWNER': '🏡 Propriétaire',
      'ORGANIZER': '🎪 Organisateur'
    };
    return labels[role] ?? role;
  }

  getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      'CAMPER': '#1a6b3c',
      'SITE_OWNER': '#7b4f00',
      'ORGANIZER': '#4a1fa8'
    };
    return colors[role] ?? '#333';
  }

  getInitials(): string {
    if (!this.user) return '?';
    return `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase();
  }

  formatDate(date: string | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  goToEdit(): void {
    this.router.navigate(['/users/edit', this.user?.id]);
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}