import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/auth.service';
import {
  NOTIFICATION_TYPES,
  NotificationFilters,
  NotificationRequest,
  NotificationResponse,
  NotificationType
} from '../models/notification.model';
import { NotificationApiService } from '../services/notification-api.service';

@Component({
  selector: 'app-notifications-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly notificationApi = inject(NotificationApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly notificationTypes = NOTIFICATION_TYPES;
  readonly notifications = signal<NotificationResponse[]>([]);
  readonly selectedNotification = signal<NotificationResponse | null>(null);
  readonly editingNotificationId = signal<string | null>(null);
  readonly unreadTotal = signal<number | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly actionKey = signal('');
  readonly message = signal('');
  readonly error = signal('');

  readonly filterForm = this.formBuilder.nonNullable.group({
    recipientId: [''],
    eventId: [''],
    read: [''],
    type: ['']
  });

  readonly notificationForm = this.formBuilder.nonNullable.group({
    recipientId: ['', [Validators.required, Validators.maxLength(120)]],
    eventId: ['', Validators.maxLength(120)],
    type: ['GENERAL' as NotificationType, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
    actionUrl: ['', Validators.maxLength(500)]
  });

  ngOnInit(): void {
    const recipientId = this.auth.userId() ?? '';
    this.filterForm.patchValue({ recipientId });
    this.notificationForm.patchValue({ recipientId });
    if (this.auth.authenticated()) {
      this.loadNotifications();
      this.refreshUnreadCount();
    }
  }

  loadNotifications(): void {
    if (!this.auth.authenticated()) return;

    const value = this.filterForm.getRawValue();
    const filters: NotificationFilters = {
      recipientId: value.recipientId.trim() || undefined,
      eventId: value.eventId.trim() || undefined,
      read: value.read === '' ? undefined : value.read === 'true',
      type: value.type ? value.type as NotificationType : undefined
    };

    this.loading.set(true);
    this.clearFeedback();
    this.notificationApi.getNotifications(filters).subscribe({
      next: notifications => {
        this.notifications.set(notifications);
        this.loading.set(false);
      },
      error: error => this.handleError(error, this.loading)
    });
  }

  loadMyInbox(): void {
    this.filterForm.reset({
      recipientId: this.auth.userId() ?? '',
      eventId: '',
      read: '',
      type: ''
    });
    this.loadNotifications();
    this.refreshUnreadCount();
  }

  loadCampingNotifications(): void {
    if (!this.auth.authenticated()) return;
    
    this.loading.set(true);
    this.clearFeedback();
    this.notificationApi.getCampingNotifications().subscribe({
      next: notifications => {
        this.notifications.set(notifications);
        this.loading.set(false);
      },
      error: error => this.handleError(error, this.loading)
    });
  }

  inspectNotification(notification: NotificationResponse): void {
    this.actionKey.set(`inspect-${notification.id}`);
    this.clearFeedback();
    this.notificationApi.getNotification(notification.id).subscribe({
      next: result => {
        this.selectedNotification.set(result);
        this.actionKey.set('');
      },
      error: error => this.handleError(error, this.actionKey)
    });
  }

  saveNotification(): void {
    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      this.error.set('Complete the required notification fields.');
      return;
    }

    const value = this.notificationForm.getRawValue();
    const request: NotificationRequest = {
      recipientId: value.recipientId.trim(),
      eventId: value.eventId.trim() || null,
      type: value.type,
      title: value.title.trim(),
      message: value.message.trim(),
      actionUrl: value.actionUrl.trim() || null
    };
    const editingId = this.editingNotificationId();
    const operation = editingId
      ? this.notificationApi.updateNotification(editingId, request)
      : this.notificationApi.createNotification(request);

    this.submitting.set(true);
    this.clearFeedback();
    operation.subscribe({
      next: notification => {
        this.applyUpdatedNotification(notification, !editingId);
        this.message.set(editingId ? 'Notification updated.' : 'Notification created and persisted.');
        this.submitting.set(false);
        this.resetNotificationForm();
        this.refreshUnreadCount(notification.recipientId);
      },
      error: error => this.handleError(error, this.submitting)
    });
  }

  editNotification(notification: NotificationResponse): void {
    this.editingNotificationId.set(notification.id);
    this.notificationForm.setValue({
      recipientId: notification.recipientId,
      eventId: notification.eventId ?? '',
      type: notification.type as NotificationType,
      title: notification.title,
      message: notification.message,
      actionUrl: notification.actionUrl ?? ''
    });
    this.message.set(`Editing "${notification.title}".`);
  }

  resetNotificationForm(): void {
    this.editingNotificationId.set(null);
    this.notificationForm.reset({
      recipientId: this.auth.userId() ?? '',
      eventId: '',
      type: 'GENERAL',
      title: '',
      message: '',
      actionUrl: ''
    });
  }

  deleteNotification(notification: NotificationResponse): void {
    if (!window.confirm(`Delete "${notification.title}"?`)) return;

    this.runAction(`delete-${notification.id}`, () => {
      this.notificationApi.deleteNotification(notification.id).subscribe({
        next: () => {
          this.notifications.update(items => items.filter(item => item.id !== notification.id));
          if (this.selectedNotification()?.id === notification.id) {
            this.selectedNotification.set(null);
          }
          this.message.set('Notification deleted.');
          this.actionKey.set('');
          this.refreshUnreadCount(notification.recipientId);
        },
        error: error => this.handleError(error, this.actionKey)
      });
    });
  }

  markAsRead(notification: NotificationResponse): void {
    if (notification.read) return;

    this.runAction(`read-${notification.id}`, () => {
      this.notificationApi.markAsRead(notification.id).subscribe({
        next: updated => {
          this.applyUpdatedNotification(updated);
          this.message.set('Notification marked as read.');
          this.actionKey.set('');
          this.refreshUnreadCount(updated.recipientId);
        },
        error: error => this.handleError(error, this.actionKey)
      });
    });
  }

  markAllAsRead(): void {
    const recipientId = this.recipientForAggregateAction();
    if (!recipientId) return;

    this.runAction('read-all', () => {
      this.notificationApi.markAllAsRead(recipientId).subscribe({
        next: result => {
          this.notifications.update(items => items.map(item =>
            item.recipientId === recipientId ? { ...item, read: true } : item
          ));
          this.unreadTotal.set(0);
          this.message.set(`${result.updatedCount} notifications marked as read.`);
          this.actionKey.set('');
        },
        error: error => this.handleError(error, this.actionKey)
      });
    });
  }

  refreshUnreadCount(recipientId = this.filterForm.getRawValue().recipientId.trim()): void {
    const targetRecipient = recipientId || this.auth.userId();
    if (!targetRecipient) {
      this.error.set('Enter a recipient ID to count unread notifications.');
      return;
    }

    this.runAction('unread-count', () => {
      this.notificationApi.getUnreadCount(targetRecipient).subscribe({
        next: result => {
          this.unreadTotal.set(result.unreadCount);
          this.message.set(`${result.unreadCount} unread notifications for ${targetRecipient}.`);
          this.actionKey.set('');
        },
        error: error => this.handleError(error, this.actionKey)
      });
    });
  }

  canManageNotifications(): boolean {
    return this.auth.hasAnyRole('ADMIN', 'ORGANIZER', 'SITE_OWNER');
  }

  private recipientForAggregateAction(): string | undefined {
    const recipientId = this.filterForm.getRawValue().recipientId.trim() || this.auth.userId();
    if (!recipientId) {
      this.error.set('Enter a recipient ID first.');
    }
    return recipientId;
  }

  private runAction(key: string, action: () => void): void {
    this.actionKey.set(key);
    this.clearFeedback();
    action();
  }

  private applyUpdatedNotification(notification: NotificationResponse, prepend = false): void {
    this.notifications.update(items => {
      const exists = items.some(item => item.id === notification.id);
      if (!exists) return prepend ? [notification, ...items] : [...items, notification];
      return items.map(item => item.id === notification.id ? notification : item);
    });
    if (this.selectedNotification()?.id === notification.id) {
      this.selectedNotification.set(notification);
    }
  }

  private clearFeedback(): void {
    this.message.set('');
    this.error.set('');
  }

  private handleError(
    error: { error?: { message?: string }; message?: string },
    state?: { set(value: any): void }
  ): void {
    if (state === this.actionKey) {
      this.actionKey.set('');
    } else {
      state?.set(false);
    }
    this.error.set(error.error?.message ?? error.message ?? 'The request could not be completed.');
  }
}
