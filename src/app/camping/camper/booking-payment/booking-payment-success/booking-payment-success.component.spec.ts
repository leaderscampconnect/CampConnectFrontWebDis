import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../../../core/testing/common-providers';
import { BookingPaymentSuccessComponent } from './booking-payment-success.component';

describe('BookingPaymentSuccessComponent', () => {
  let component: BookingPaymentSuccessComponent;
  let fixture: ComponentFixture<BookingPaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPaymentSuccessComponent],
      providers: [commonTestingProviders]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
