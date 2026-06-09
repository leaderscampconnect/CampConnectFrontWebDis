import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth.service';
import {
  EventCategory,
  EventRequest,
  EventResponse
} from './models/event.model';
import { NotificationResponse } from './models/notification.model';
import { EventApiService } from './services/event-api.service';
import { NotificationApiService } from './services/notification-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly eventApi = inject(EventApiService);
  private readonly notificationApi = inject(NotificationApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly events = signal<EventResponse[]>([]);
  readonly notifications = signal<NotificationResponse[]>([]);
  readonly loadingEvents = signal(false);
  readonly loadingNotifications = signal(false);
  readonly submitting = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly categories: EventCategory[] = [
    'ADVENTURE',
    'CAMPING_ACTIVITY',
    'GUIDED_TOUR',
    'SOCIAL_EVENT',
    'WELLNESS',
    'WORKSHOP',
    'EDUCATIONAL',
    'OTHER'
  ];

  readonly eventForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    category: ['CAMPING_ACTIVITY' as EventCategory, Validators.required],
    startAt: ['', Validators.required],
    endAt: ['', Validators.required],
    location: ['', [Validators.required, Validators.maxLength(255)]],
    capacity: [20, [Validators.required, Validators.min(1), Validators.max(10000)]],
    waitlistCapacity: [5, [Validators.required, Validators.min(0), Validators.max(1000)]],
    price: [0, [Validators.required, Validators.min(0)]],
    published: [true]
  });

  ngOnInit(): void {
    this.loadEvents();
    if (this.auth.authenticated()) {
      this.loadNotifications();
    }
  }

  loadEvents(): void {
    this.loadingEvents.set(true);
    this.eventApi.getEvents().subscribe({
      next: events => {
        this.events.set(events);
        this.loadingEvents.set(false);
      },
      error: error => this.handleError(error, this.loadingEvents)
    });
  }

  loadNotifications(): void {
    const recipientId = this.auth.userId();
    if (!recipientId) {
      return;
    }

    this.loadingNotifications.set(true);
    this.notificationApi.getForRecipient(recipientId).subscribe({
      next: notifications => {
        this.notifications.set(notifications);
        this.loadingNotifications.set(false);
      },
      error: error => this.handleError(error, this.loadingNotifications)
    });
  }

  createEvent(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const organizerId = this.auth.userId();
    if (!organizerId) {
      this.error.set('Sign in before creating an event.');
      return;
    }

    const value = this.eventForm.getRawValue();
    const request: EventRequest = {
      ...value,
      organizerId
    };

    this.submitting.set(true);
    this.clearFeedback();
    this.eventApi.createEvent(request).subscribe({
      next: event => {
        this.events.update(events => [event, ...events]);
        this.message.set(`Event "${event.title}" was created.`);
        this.submitting.set(false);
        this.eventForm.reset({
          category: 'CAMPING_ACTIVITY',
          capacity: 20,
          waitlistCapacity: 5,
          price: 0,
          published: true,
          title: '',
          description: '',
          startAt: '',
          endAt: '',
          location: ''
        });
      },
      error: error => this.handleError(error, this.submitting)
    });
  }

  register(event: EventResponse): void {
    const participantId = this.auth.userId();
    if (!participantId) {
      void this.auth.login();
      return;
    }

    this.clearFeedback();
    this.eventApi.register(event.id, participantId).subscribe({
      next: result => {
        this.events.update(events =>
          events.map(item => item.id === result.event.id ? result.event : item)
        );
        this.message.set(
          result.registrationStatus === 'CONFIRMED'
            ? `Registration confirmed for "${event.title}".`
            : `The event is full. You are number ${result.waitlistPosition} on the waitlist.`
        );
        this.loadNotifications();
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

  canManageEvents(): boolean {
    return this.auth.hasAnyRole('ADMIN', 'ORGANIZER');
  }

  private clearFeedback(): void {
    this.message.set('');
    this.error.set('');
  }

  private handleError(
    error: { error?: { message?: string }; message?: string },
    loadingSignal?: { set(value: boolean): void }
  ): void {
    loadingSignal?.set(false);
    this.error.set(error.error?.message ?? error.message ?? 'The request could not be completed.');
  }
}
