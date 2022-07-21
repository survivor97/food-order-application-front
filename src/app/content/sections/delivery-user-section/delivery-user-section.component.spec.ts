import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryUserSectionComponent } from './delivery-user-section.component';

describe('DeliveryUserSectionComponent', () => {
  let component: DeliveryUserSectionComponent;
  let fixture: ComponentFixture<DeliveryUserSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryUserSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryUserSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
