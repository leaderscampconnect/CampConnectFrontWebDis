import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampingListComponent } from './camping-list.component';

describe('CampingListComponent', () => {
  let component: CampingListComponent;
  let fixture: ComponentFixture<CampingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingListComponent]
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
