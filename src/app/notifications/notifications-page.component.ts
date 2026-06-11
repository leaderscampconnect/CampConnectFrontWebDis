import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/auth.service';
import { NotificationResponse } from '../models/notification.model';
import { NotificationApiService } from '../services/notification-api.service';

@Component({
  selector: 'app-notifications-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly notificationApi = inject(NotificationApiService);

  readonly notifications = signal<NotificationResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const recipientId = this.auth.userId();
    if (!recipientId) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.notificationApi.getForRecipient(recipientId).subscribe({
      next: notifications => {
        this.notifications.set(notifications);
        this.loading.set(false);
      },
      error: error => this.handleError(error)
    });
  }

  markAsRead(notification: NotificationResponse): void {
    if (notification.read) {
      return;
    }

    this.notificationApi.markAsRead(notification.id).subscribe({
      next: updated => this.notifications.update(notifications =>
        notifications.map(item => item.id === updated.id ? updated : item)
      ),
      error: error => this.handleError(error)
    });
  }

  markAllAsRead(): void {
    const recipientId = this.auth.userId();
    if (!recipientId) {
      return;
    }

    this.notificationApi.markAllAsRead(recipientId).subscribe({
      next: () => this.loadNotifications(),
      error: error => this.handleError(error)
    });
  }

  unreadCount(): number {
    return this.notifications().filter(notification => !notification.read).length;
  }

  private handleError(error: { error?: { message?: string }; message?: string }): void {
    this.loading.set(false);
    this.error.set(error.error?.message ?? error.message ?? 'Notifications could not be loaded.');
  }
}
