import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
