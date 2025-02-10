import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginGuard } from '@/app/auth/guards/login.guard';

describe('loginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
