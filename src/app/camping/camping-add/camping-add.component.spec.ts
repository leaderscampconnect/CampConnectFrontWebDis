import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampingAddComponent } from './camping-add.component';

describe('CampingAddComponent', () => {
  let component: CampingAddComponent;
  let fixture: ComponentFixture<CampingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingAddComponent]
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
