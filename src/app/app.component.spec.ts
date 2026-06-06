import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';
import { EventApiService } from './services/event-api.service';
import { NotificationApiService } from './services/notification-api.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticated: signal(false),
            username: signal('Guest'),
            roles: signal([]),
            userId: () => undefined,
            hasAnyRole: () => false,
            login: () => Promise.resolve(),
            logout: () => Promise.resolve()
          }
        },
        {
          provide: EventApiService,
          useValue: {
            getEvents: () => of([]),
            createEvent: () => of({}),
            register: () => of({})
          }
        },
        {
          provide: NotificationApiService,
          useValue: {
            getForRecipient: () => of([]),
            markAsRead: () => of({}),
            markAllAsRead: () => of({ updatedCount: 0 })
          }
        }
      ]
    }).compileComponents();
  });

  it('creates the application and loads events', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toContain('Make the next camp memory count');
  });
});
