import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  EventAvailabilityResponse,
  EventFilters,
  EventStatus,
  EventRequest,
  EventResponse,
  EventsWithNotificationsResponse,
  EventNotificationResponse,
  RegistrationResponse
} from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/events';

  getEvents(filters: EventFilters = {}): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(this.baseUrl, { params: this.toParams(filters) });
  }

  getEvent(id: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.baseUrl}/${id}`);
  }

  search(keyword: string): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/search`, {
      params: { keyword }
    });
  }

  getUpcoming(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/upcoming`);
  }

  getAvailable(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/available`);
  }

  getAvailability(id: string): Observable<EventAvailabilityResponse> {
    return this.http.get<EventAvailabilityResponse>(`${this.baseUrl}/${id}/availability`);
  }

  getEventNotifications(): Observable<EventNotificationResponse[]> {
    return this.http.get<EventNotificationResponse[]>(`${this.baseUrl}/notifications`);
  }

  getEventsWithNotifications(): Observable<EventsWithNotificationsResponse> {
    return this.http.get<EventsWithNotificationsResponse>(
      `${this.baseUrl}/with-notification`
    );
  }

  createEvent(request: EventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.baseUrl, request);
  }

  updateEvent(id: string, request: EventRequest): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.baseUrl}/${id}`, request);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  publish(id: string): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.baseUrl}/${id}/publish`, {});
  }

  unpublish(id: string): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.baseUrl}/${id}/unpublish`, {});
  }

  postpone(id: string, startAt: string, endAt: string): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.baseUrl}/${id}/postpone`, {
      startAt,
      endAt
    });
  }

  cancel(id: string, reason: string): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  changeStatus(id: string, status: EventStatus): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.baseUrl}/${id}/status`, {}, {
      params: { status }
    });
  }

  register(eventId: string, participantId: string): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      `${this.baseUrl}/${eventId}/registrations`,
      { participantId }
    );
  }

  cancelRegistration(eventId: string, participantId: string): Observable<EventResponse> {
    return this.http.delete<EventResponse>(
      `${this.baseUrl}/${eventId}/registrations/${participantId}`
    );
  }

  private toParams(filters: EventFilters): Record<string, string> {
    const params: Record<string, string> = {};
    if (filters.category) params['category'] = filters.category;
    if (filters.status) params['status'] = filters.status;
    if (filters.location) params['location'] = filters.location;
    if (filters.published !== undefined) params['published'] = String(filters.published);
    return params;
  }
}
