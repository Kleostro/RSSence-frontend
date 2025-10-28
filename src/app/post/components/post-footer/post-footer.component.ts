import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { PostCommentsComponent } from '@/app/post/components/post-comments/post-comments.component';
import { PostViewsComponent } from '@/app/post/components/post-views/post-views.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostViewsComponent, PostCommentsComponent],
  selector: 'app-post-footer',
  styleUrl: './post-footer.component.scss',
  templateUrl: './post-footer.component.html',
})
export class PostFooterComponent {
  public post = input.required<PostResponse>();
}
