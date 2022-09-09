import { TestBed } from '@angular/core/testing';

import { XatsService } from './xats.service';

describe('XatsService', () => {
  let service: XatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
