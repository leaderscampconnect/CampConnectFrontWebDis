import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NotificationApiService } from './notification-api.service';

describe('NotificationApiService', () => {
  let service: NotificationApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(NotificationApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads notifications with filters', () => {
    service.getNotifications({
      recipientId: 'user-1',
      read: false,
      type: 'GENERAL'
    }).subscribe(notifications => expect(notifications).toEqual([]));

    const request = http.expectOne(
      value => value.url === '/api/notifications'
        && value.params.get('recipientId') === 'user-1'
        && value.params.get('read') === 'false'
        && value.params.get('type') === 'GENERAL'
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('creates a persisted notification', () => {
    const body = {
      recipientId: 'user-1',
      eventId: null,
      type: 'GENERAL' as const,
      title: 'Test',
      message: 'Test message',
      actionUrl: null
    };

    service.createNotification(body).subscribe();

    const request = http.expectOne('/api/notifications');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush({});
  });

  it('marks all recipient notifications as read', () => {
    service.markAllAsRead('user-1').subscribe();

    const request = http.expectOne('/api/notifications/recipient/user-1/read-all');
    expect(request.request.method).toBe('PATCH');
    request.flush({ updatedCount: 2 });
  });
});
