import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CampingAddComponent } from './camping-add.component';

describe('CampingAddComponent', () => {
  let component: CampingAddComponent;
  let fixture: ComponentFixture<CampingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingAddComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
