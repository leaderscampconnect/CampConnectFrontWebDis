
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';


import { SiteBookingsComponent } from './site-bookings.component';

describe('SiteBookingsComponent', () => {
  let component: SiteBookingsComponent;
  let fixture: ComponentFixture<SiteBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteBookingsComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
