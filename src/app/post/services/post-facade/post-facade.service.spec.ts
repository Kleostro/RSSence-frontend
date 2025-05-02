import { TestBed } from '@angular/core/testing';

import { PostFacadeService } from '@/app/post/services/post-facade/post-facade.service';

describe('PostFacadeService', () => {
  let service: PostFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
