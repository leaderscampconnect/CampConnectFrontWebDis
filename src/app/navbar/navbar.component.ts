import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CampingNotificationApiService } from '../services/camping-notification-api.service';
import { CampingNotificationResponse } from '../models/camping-notification.model';
import { Subscription, timer } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  notificationApi = inject(CampingNotificationApiService);
  router = inject(Router);

  unreadCount = signal(0);
  showDropdown = signal(false);
  notifications = signal<CampingNotificationResponse[]>([]);
  private pollingSub?: Subscription;

  ngOnInit() {
    this.pollingSub = timer(0, 30000).pipe(
      filter(() => this.auth.authenticated() && !!this.auth.userId()),
      switchMap(() => this.notificationApi.getUnreadCount(this.auth.userId()!))
    ).subscribe({
      next: (res) => this.unreadCount.set(res.unreadCount),
      error: (err) => console.error('Failed to poll unread count', err)
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-bell')) {
      this.showDropdown.set(false);
    }
  }

  toggleDropdown() {
    this.showDropdown.update(val => !val);
    if (this.showDropdown()) {
      this.fetchNotifications();
      // Only mark all as read when opening dropdown
      this.markAllAsRead();
    }
  }

  fetchNotifications() {
    if (!this.auth.authenticated() || !this.auth.userId()) return;
    this.notificationApi.getNotifications({
      recipientId: this.auth.userId()!
    }).subscribe({
      next: (res) => this.notifications.set(res),
      error: (err) => console.error('Failed to fetch notifications', err)
    });
  }

  markAllAsRead() {
    if (!this.auth.authenticated() || !this.auth.userId() || this.unreadCount() === 0) return;
    this.notificationApi.markAllAsRead(this.auth.userId()!).subscribe({
      next: () => {
        this.unreadCount.set(0);
        this.fetchNotifications(); // Refresh list to show as read
      },
      error: (err) => console.error('Failed to mark notifications as read', err)
    });
  }

  handleNotificationClick(event: MouseEvent, notification: CampingNotificationResponse) {
    event.stopPropagation(); // Prevent closing dropdown immediately
    
    // Navigate based on type
    if (notification.type === 'BOOKING_RECEIVED') {
      this.router.navigate(['/owner/dashboard']);
    } else {
      this.router.navigate(['/camper/bookings']);
    }
    this.showDropdown.set(false);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
    this.showDropdown.set(false);
  }
}
