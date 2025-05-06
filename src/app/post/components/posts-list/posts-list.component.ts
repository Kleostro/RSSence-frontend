import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { PostResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostComponent],
  selector: 'app-posts-list',
  styleUrl: './posts-list.component.scss',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  public readonly authorService = inject(AuthorService);
  public readonly navigationService = inject(NavigationService);
  public isShowPostActions = input<boolean>(true);
  public posts = input<null | PostResponse[]>(null);
}
