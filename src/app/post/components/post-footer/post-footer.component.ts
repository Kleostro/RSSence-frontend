import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PostResponse } from '@/app/api/schemas/posts-response';
import { PostViewsComponent } from '@/app/post/components/post-views/post-views.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostViewsComponent],
  selector: 'app-post-footer',
  styleUrl: './post-footer.component.scss',
  templateUrl: './post-footer.component.html',
})
export class PostFooterComponent {
  public post = input<null | PostResponse>(null);
}
