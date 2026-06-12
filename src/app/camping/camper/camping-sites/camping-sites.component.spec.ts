
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CampingSitesComponent } from './camping-sites.component';

describe('CampingSitesComponent', () => {
  let component: CampingSitesComponent;
  let fixture: ComponentFixture<CampingSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingSitesComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampingSitesComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
