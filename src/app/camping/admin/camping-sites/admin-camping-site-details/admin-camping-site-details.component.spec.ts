import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../../core/testing/common-providers';
import { AdminCampingSiteDetailsComponent } from './admin-camping-site-details.component';

describe('AdminCampingSiteDetailsComponent', () => {
  let component: AdminCampingSiteDetailsComponent;
  let fixture: ComponentFixture<AdminCampingSiteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCampingSiteDetailsComponent],
      providers: [commonTestingProviders]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCampingSiteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
