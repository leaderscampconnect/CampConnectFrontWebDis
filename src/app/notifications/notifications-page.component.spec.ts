import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { NotificationApiService } from '../services/notification-api.service';
import { NotificationsPageComponent } from './notifications-page.component';

describe('NotificationsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            authenticated: signal(true),
            userId: () => 'user-1',
            hasAnyRole: () => false,
            login: () => Promise.resolve()
          }
        },
        {
          provide: NotificationApiService,
          useValue: {
            getNotifications: () => of([]),
            getUnreadCount: () => of({ unreadCount: 0 }),
            markAsRead: () => of({}),
            markAllAsRead: () => of({ updatedCount: 0 })
          }
        }
      ]
    }).compileComponents();
  });

  it('loads the signed-in user notification inbox', () => {
    const fixture = TestBed.createComponent(NotificationsPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.notifications()).toEqual([]);
    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toContain('Notifications');
  });
});
