import { TestBed } from '@angular/core/testing';

import { SocketsIoService } from './sockets-io.service';

describe('SocketsIoService', () => {
  let service: SocketsIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketsIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
