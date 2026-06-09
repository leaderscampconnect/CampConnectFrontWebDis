import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CampingListComponent } from './camping-list.component';

describe('CampingListComponent', () => {
  let component: CampingListComponent;
  let fixture: ComponentFixture<CampingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
