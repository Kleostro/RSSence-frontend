import { TestBed } from '@angular/core/testing';

import { RefreshTokenService } from '@/app/api/services/refreshToken/refresh-token.service';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
