import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/auth.service';
import {
  EventCategory,
  EventRequest,
  EventResponse
} from '../models/event.model';
import { EventApiService } from '../services/event-api.service';

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
  readonly loading = signal(false);
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
  }

  loadEvents(): void {
    this.loading.set(true);
    this.clearFeedback();
    this.eventApi.getEvents().subscribe({
      next: events => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: error => this.handleError(error, this.loading)
    });
  }

  createEvent(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.error.set('Please complete the required event information.');
      return;
    }

    const organizerId = this.auth.userId();
    if (!organizerId) {
      void this.auth.login();
      return;
    }

    const request: EventRequest = {
      ...this.eventForm.getRawValue(),
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
          title: '',
          description: '',
          category: 'CAMPING_ACTIVITY',
          startAt: '',
          endAt: '',
          location: '',
          capacity: 20,
          waitlistCapacity: 5,
          price: 0,
          published: true
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
            : `You are number ${result.waitlistPosition} on the waitlist.`
        );
      },
      error: error => this.handleError(error)
    });
  }

  canManageEvents(): boolean {
    return this.auth.hasAnyRole('ADMIN', 'ORGANIZER');
  }

  isRegistered(event: EventResponse): boolean {
    const userId = this.auth.userId();
    return Boolean(userId && (
      event.participantIds.includes(userId) ||
      event.waitlistParticipantIds.includes(userId)
    ));
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
