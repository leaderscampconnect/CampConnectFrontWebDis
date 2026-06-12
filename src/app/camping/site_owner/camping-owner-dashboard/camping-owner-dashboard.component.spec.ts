import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestingProviders } from '../../../core/testing/common-providers';
import { CampingOwnerDashboardComponent } from './camping-owner-dashboard.component';

describe('CampingOwnerDashboardComponent', () => {
  let component: CampingOwnerDashboardComponent;
  let fixture: ComponentFixture<CampingOwnerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingOwnerDashboardComponent],
      providers: [commonTestingProviders]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampingOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
