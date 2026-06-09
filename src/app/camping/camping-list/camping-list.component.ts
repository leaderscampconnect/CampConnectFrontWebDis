import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CampingService, SiteCamping } from '../../services/camping.service';

@Component({
  selector: 'app-camping-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './camping-list.component.html',
  styleUrl: './camping-list.component.scss'
})
export class CampingListComponent implements OnInit {
  private campingService = inject(CampingService);

  readonly campings = signal<SiteCamping[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadCampings();
  }

  loadCampings(): void {
    this.loading.set(true);
    this.error.set('');
    this.campingService.getAllCampings().subscribe({
      next: (data) => {
        this.campings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load campings. ' + (err.error?.message || err.message));
        this.loading.set(false);
      }
    });
  }
}
