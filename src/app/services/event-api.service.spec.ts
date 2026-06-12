import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { EventApiService } from './event-api.service';

describe('EventApiService', () => {
  let service: EventApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EventApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads published events through the gateway', () => {
    service.getEvents().subscribe(events => expect(events).toEqual([]));

    const request = http.expectOne('/api/events?published=true');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('registers a participant', () => {
    service.register('event-1', 'user-1').subscribe();

    const request = http.expectOne('/api/events/event-1/registrations');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ participantId: 'user-1' });
    request.flush({});
  });
});
