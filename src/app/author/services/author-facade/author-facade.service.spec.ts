import { TestBed } from '@angular/core/testing';

import { AuthorFacadeService } from '@/app/author/services/author-facade/author-facade.service';

describe('AuthorFacadeService', () => {
  let service: AuthorFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
