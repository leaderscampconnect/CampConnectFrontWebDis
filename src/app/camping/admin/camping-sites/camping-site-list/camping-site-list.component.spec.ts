import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CampingSiteListComponent } from './camping-site-list.component';

describe('CampingSiteListComponent', () => {
  let component: CampingSiteListComponent;
  let fixture: ComponentFixture<CampingSiteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingSiteListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampingSiteListComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
