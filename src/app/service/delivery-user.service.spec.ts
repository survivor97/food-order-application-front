import { TestBed } from '@angular/core/testing';

import { DeliveryUserService } from './delivery-user.service';

describe('DeliveryUserService', () => {
  let service: DeliveryUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
