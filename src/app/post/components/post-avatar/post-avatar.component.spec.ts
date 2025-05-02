import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';

describe('PostAvatarComponent', () => {
  let component: PostAvatarComponent;
  let fixture: ComponentFixture<PostAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
