import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    public router: Router        // public → utilisé dans le template
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.errorMessage = 'Erreur de chargement'; this.loading = false; }
    });
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'CAMPER':     '🏕 Campeur',
      'SITE_OWNER': '🏡 Propriétaire',
      'ORGANIZER':  '🎪 Organisateur'
    };
    return labels[role] ?? role;
  }

  goToCreate(): void {
    this.router.navigate(['/users/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: () => this.errorMessage = 'Erreur lors de la suppression'
      });
    }
  }
}