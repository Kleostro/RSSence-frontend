import { TestBed } from '@angular/core/testing';

import { ProfileFacadeService } from '@/app/profile/services/profile-facade/profile-facade.service';

describe('ProfileFacadeService', () => {
  let service: ProfileFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
