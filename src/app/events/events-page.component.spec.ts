import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { EventApiService } from '../services/event-api.service';
import { EventsPageComponent } from './events-page.component';

describe('EventsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsPageComponent],
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
          provide: EventApiService,
          useValue: {
            getEvents: () => of([]),
            createEvent: () => of({}),
            register: () => of({})
          }
        }
      ]
    }).compileComponents();
  });

  it('loads and renders the event page', () => {
    const fixture = TestBed.createComponent(EventsPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.events()).toEqual([]);
    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toContain('Events and activities');
  });
});
