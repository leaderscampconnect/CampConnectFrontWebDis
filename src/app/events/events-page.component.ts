import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

import { AuthService } from '../core/auth.service';
import {
  EventAvailabilityResponse,
  EventCategory,
  EventNotificationResponse,
  EventRequest,
  EventResponse,
  EventStatus
} from '../models/event.model';
import { EventApiService } from '../services/event-api.service';

type EventView = 'all' | 'upcoming' | 'available' | 'search';

@Component({
  selector: 'app-events-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss'
})
export class EventsPageComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly eventApi = inject(EventApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly events = signal<EventResponse[]>([]);
  readonly selectedEvent = signal<EventResponse | null>(null);
  readonly availability = signal<EventAvailabilityResponse | null>(null);
  readonly integrationNotifications = signal<EventNotificationResponse[]>([]);
  readonly editingEventId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly actionKey = signal('');
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
  readonly statuses: EventStatus[] = [
    'DRAFT',
    'SCHEDULED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED',
    'POSTPONED'
  ];

  readonly filterForm = this.formBuilder.nonNullable.group({
    view: ['all' as EventView],
    keyword: [''],
    category: [''],
    status: [''],
    location: [''],
    published: ['true']
  });

  readonly eventForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    category: ['CAMPING_ACTIVITY' as EventCategory, Validators.required],
    startAt: ['', Validators.required],
    endAt: ['', Validators.required],
    location: ['', [Validators.required, Validators.maxLength(255)]],
    organizerId: ['', [Validators.required, Validators.maxLength(120)]],
    capacity: [20, [Validators.required, Validators.min(1), Validators.max(10000)]],
    waitlistCapacity: [5, [Validators.required, Validators.min(0), Validators.max(1000)]],
    price: [0, [Validators.required, Validators.min(0)]],
    published: [true]
  });

  readonly registrationForm = this.formBuilder.nonNullable.group({
    participantId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
  });

  readonly postponeForm = this.formBuilder.nonNullable.group({
    startAt: ['', Validators.required],
    endAt: ['', Validators.required]
  });

  readonly cancellationForm = this.formBuilder.nonNullable.group({
    reason: ['', [Validators.required, Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    this.eventForm.patchValue({ organizerId: this.auth.userId() ?? '' });
    this.loadEvents();
  }

  loadEvents(): void {
    const value = this.filterForm.getRawValue();
    const view = value.view;
    let request: Observable<EventResponse[]>;

    if (view === 'upcoming') {
      request = this.eventApi.getUpcoming();
    } else if (view === 'available') {
      request = this.eventApi.getAvailable();
    } else if (view === 'search') {
      const keyword = value.keyword.trim();
      if (!keyword) {
        this.error.set('Enter a keyword before searching.');
        return;
      }
      request = this.eventApi.search(keyword);
    } else {
      request = this.eventApi.getEvents({
        category: value.category as EventCategory || undefined,
        status: value.status as EventStatus || undefined,
        location: value.location.trim() || undefined,
        published: value.published === '' ? undefined : value.published === 'true'
      });
    }

    this.loading.set(true);
    this.clearFeedback();
    request.subscribe({
      next: events => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: error => this.handleError(error, this.loading)
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      view: 'all',
      keyword: '',
      category: '',
      status: '',
      location: '',
      published: 'true'
    });
    this.loadEvents();
  }

  inspectEvent(event: EventResponse): void {
    this.actionKey.set(`inspect-${event.id}`);
    this.clearFeedback();
    forkJoin({
      event: this.eventApi.getEvent(event.id),
      availability: this.eventApi.getAvailability(event.id)
    }).subscribe({
      next: result => {
        this.selectedEvent.set(result.event);
        this.availability.set(result.availability);
        this.actionKey.set('');
      },
      error: error => this.handleError(error, this.actionKey)
    });
  }

  saveEvent(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.error.set('Please complete the required event information.');
      return;
    }

    const request: EventRequest = this.eventForm.getRawValue();
    const editingId = this.editingEventId();
    this.submitting.set(true);
    this.clearFeedback();

    const operation = editingId
      ? this.eventApi.updateEvent(editingId, request)
      : this.eventApi.createEvent(request);

    operation.subscribe({
      next: event => {
        this.applyUpdatedEvent(event, !editingId);
        this.message.set(editingId
          ? `Event "${event.title}" was updated.`
          : `Event "${event.title}" was created.`);
        this.submitting.set(false);
        this.resetEventForm();
      },
      error: error => this.handleError(error, this.submitting)
    });
  }

  editEvent(event: EventResponse): void {
    this.editingEventId.set(event.id);
    this.eventForm.setValue({
      title: event.title,
      description: event.description,
      category: event.category,
      startAt: this.toDateTimeInput(event.startAt),
      endAt: this.toDateTimeInput(event.endAt),
      location: event.location,
      organizerId: event.organizerId,
      capacity: event.capacity,
      waitlistCapacity: event.waitlistCapacity,
      price: event.price,
      published: event.published
    });
    this.message.set(`Editing "${event.title}".`);
  }

  resetEventForm(): void {
    this.editingEventId.set(null);
    this.eventForm.reset({
      title: '',
      description: '',
      category: 'CAMPING_ACTIVITY',
      startAt: '',
      endAt: '',
      location: '',
      organizerId: this.auth.userId() ?? '',
      capacity: 20,
      waitlistCapacity: 5,
      price: 0,
      published: true
    });
  }

  register(event: EventResponse): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.error.set('Registration requires a numeric User Service ID.');
      return;
    }
    const participantId = this.registrationForm.getRawValue().participantId;
    this.runEventAction(
      `register-${event.id}`,
      this.eventApi.register(event.id, participantId),
      result => {
        this.applyUpdatedEvent(result.event);
        this.message.set(result.registrationStatus === 'CONFIRMED'
          ? `User ${participantId} is confirmed for "${event.title}".`
          : `User ${participantId} joined waitlist position ${result.waitlistPosition}.`);
      }
    );
  }

  cancelRegistration(event: EventResponse): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.error.set('Enter the numeric participant ID to cancel.');
      return;
    }
    const participantId = this.registrationForm.getRawValue().participantId;
    this.runEventUpdate(
      `unregister-${event.id}`,
      this.eventApi.cancelRegistration(event.id, participantId),
      `Registration for user ${participantId} was cancelled.`
    );
  }

  publish(event: EventResponse): void {
    this.runEventUpdate(`publish-${event.id}`, this.eventApi.publish(event.id), 'Event published.');
  }

  unpublish(event: EventResponse): void {
    this.runEventUpdate(
      `unpublish-${event.id}`,
      this.eventApi.unpublish(event.id),
      'Event returned to draft.'
    );
  }

  postpone(event: EventResponse): void {
    if (this.postponeForm.invalid) {
      this.postponeForm.markAllAsTouched();
      this.error.set('Select both new event dates.');
      return;
    }
    const value = this.postponeForm.getRawValue();
    this.runEventUpdate(
      `postpone-${event.id}`,
      this.eventApi.postpone(event.id, value.startAt, value.endAt),
      'Event postponed and participants notified.'
    );
  }

  cancelEvent(event: EventResponse): void {
    if (this.cancellationForm.invalid) {
      this.cancellationForm.markAllAsTouched();
      this.error.set('Provide a cancellation reason.');
      return;
    }
    this.runEventUpdate(
      `cancel-${event.id}`,
      this.eventApi.cancel(event.id, this.cancellationForm.getRawValue().reason),
      'Event cancelled and participants notified.'
    );
  }

  changeStatus(event: EventResponse, status: EventStatus): void {
    this.runEventUpdate(
      `status-${event.id}`,
      this.eventApi.changeStatus(event.id, status),
      `Event status changed to ${status}.`
    );
  }

  deleteEvent(event: EventResponse): void {
    if (!window.confirm(`Delete "${event.title}"?`)) return;

    this.runEventAction(`delete-${event.id}`, this.eventApi.deleteEvent(event.id), () => {
      this.events.update(events => events.filter(item => item.id !== event.id));
      if (this.selectedEvent()?.id === event.id) {
        this.selectedEvent.set(null);
        this.availability.set(null);
      }
      this.message.set('Event deleted.');
    });
  }

  loadEventNotifications(): void {
    this.runEventAction('event-notifications', this.eventApi.getEventNotifications(), notifications => {
      this.integrationNotifications.set(notifications);
      this.message.set(`Loaded ${notifications.length} notifications through Event Service Feign.`);
    });
  }

  loadCombinedView(): void {
    this.runEventAction('combined', this.eventApi.getEventsWithNotifications(), result => {
      this.events.set(result.events);
      this.integrationNotifications.set(result.notifications);
      this.message.set(
        `Feign aggregation loaded ${result.events.length} events and ${result.notifications.length} notifications.`
      );
    });
  }

  canManageEvents(): boolean {
    return this.auth.hasAnyRole('ADMIN', 'ORGANIZER');
  }

  canRegister(): boolean {
    return this.auth.hasAnyRole('USER', 'ADMIN', 'ORGANIZER');
  }

  private runEventUpdate(
    key: string,
    request: Observable<EventResponse>,
    successMessage: string
  ): void {
    this.runEventAction(key, request, event => {
      this.applyUpdatedEvent(event);
      this.message.set(successMessage);
      this.inspectEvent(event);
    });
  }

  private runEventAction<T>(
    key: string,
    request: Observable<T>,
    onSuccess: (value: T) => void
  ): void {
    this.actionKey.set(key);
    this.clearFeedback();
    request.subscribe({
      next: value => {
        onSuccess(value);
        this.actionKey.set('');
      },
      error: error => this.handleError(error, this.actionKey)
    });
  }

  private applyUpdatedEvent(event: EventResponse, prepend = false): void {
    this.events.update(events => {
      const exists = events.some(item => item.id === event.id);
      if (!exists) return prepend ? [event, ...events] : [...events, event];
      return events.map(item => item.id === event.id ? event : item);
    });
    if (this.selectedEvent()?.id === event.id) this.selectedEvent.set(event);
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

  private toDateTimeInput(value: string): string {
    return value ? value.slice(0, 16) : '';
  }
}
