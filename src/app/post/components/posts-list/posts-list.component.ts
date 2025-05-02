import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { PostsResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { PostPreviewComponent } from '@/app/post/components/post-preview/post-preview.component';
import { PostComponent } from '@/app/post/components/post/post.component';

@Component({
  selector: 'app-posts-list',
  imports: [PostPreviewComponent, PostComponent],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsListComponent {
  public posts = input<PostsResponse[] | null>(null);
  public mode = input<'preview' | 'full'>('preview');

  public readonly authorService = inject(AuthorService);
}
