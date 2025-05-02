import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailedComponent } from '@/app/post/pages/post-detailed/post-detailed.component';

describe('PostDetailedPageComponent', () => {
  let component: PostDetailedComponent;
  let fixture: ComponentFixture<PostDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
