import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProductComponent } from './stock-product.component';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('StockProductComponent', () => {
  let component: StockProductComponent;
  let fixture: ComponentFixture<StockProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockProductComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
