import { TestBed } from '@angular/core/testing';

import { PayloadBuilder } from './template.service';

describe('PayloadBuilder', () => {
  let service: PayloadBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayloadBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
