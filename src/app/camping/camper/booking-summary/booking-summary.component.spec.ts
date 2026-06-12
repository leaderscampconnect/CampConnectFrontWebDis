import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../../../core/testing/common-providers';
import { BookingSummaryComponent } from './booking-summary.component';
import { AuthService } from '../../../core/auth.service';

describe('BookingSummaryComponent', () => {
  let component: BookingSummaryComponent;
  let fixture: ComponentFixture<BookingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSummaryComponent],
      providers: [commonTestingProviders]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login when confirmPayment is clicked and user is not authenticated', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'authenticated').and.returnValue(false);
    const loginSpy = spyOn(authService, 'login');

    // Simulate clicking pay with dummy booking data
    component.bookingData = {} as any;
    component.confirmPayment();

    expect(loginSpy).toHaveBeenCalled();
  });
});
