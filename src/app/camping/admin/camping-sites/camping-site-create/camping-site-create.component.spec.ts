import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CampingSiteCreateComponent } from './camping-site-create.component';

describe('CampingSiteCreateComponent', () => {
  let component: CampingSiteCreateComponent;
  let fixture: ComponentFixture<CampingSiteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingSiteCreateComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampingSiteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
