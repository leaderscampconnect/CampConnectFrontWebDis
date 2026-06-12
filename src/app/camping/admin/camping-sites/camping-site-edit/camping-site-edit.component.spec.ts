import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CampingSiteEditComponent } from './camping-site-edit.component';

describe('CampingSiteEditComponent', () => {
  let component: CampingSiteEditComponent;
  let fixture: ComponentFixture<CampingSiteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingSiteEditComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampingSiteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
