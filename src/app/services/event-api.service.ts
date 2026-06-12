import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  EventRequest,
  EventResponse,
  RegistrationResponse
} from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/events';

  getEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(this.baseUrl, {
      params: { published: true }
    });
  }

  createEvent(request: EventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.baseUrl, request);
  }

  register(eventId: string, participantId: string): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      `${this.baseUrl}/${eventId}/registrations`,
      { participantId }
    );
  }
}
