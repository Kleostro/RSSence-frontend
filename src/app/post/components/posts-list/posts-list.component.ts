import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { PostsResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { PostPreviewComponent } from '@/app/post/components/post-preview/post-preview.component';
import { PostComponent } from '@/app/post/components/post/post.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostPreviewComponent, PostComponent],
  selector: 'app-posts-list',
  styleUrl: './posts-list.component.scss',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  public readonly authorService = inject(AuthorService);

  public mode = input<'full' | 'preview'>('preview');
  public posts = input<null | PostsResponse[]>(null);
}
