import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CampingDetailComponent } from './camping-detail.component';

describe('CampingDetailComponent', () => {
  let component: CampingDetailComponent;
  let fixture: ComponentFixture<CampingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
