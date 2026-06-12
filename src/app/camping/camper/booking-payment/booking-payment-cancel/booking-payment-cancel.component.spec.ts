import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../../../core/testing/common-providers';
import { BookingPaymentCancelComponent } from './booking-payment-cancel.component';

describe('BookingPaymentCancelComponent', () => {
  let component: BookingPaymentCancelComponent;
  let fixture: ComponentFixture<BookingPaymentCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPaymentCancelComponent],
      providers: [commonTestingProviders]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingPaymentCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
