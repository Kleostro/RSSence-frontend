import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { concatMap, Subject, takeUntil, tap } from 'rxjs';

import { PostsResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostService } from '@/app/post/services/post/post.service';

@Component({
  selector: 'app-post-detailed',
  imports: [PostComponent, ButtonModule, RippleModule],
  templateUrl: './post-detailed.component.html',
  styleUrl: './post-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailedComponent implements OnInit, OnDestroy {
  public postId = input<string | null>(null, { alias: 'id' });

  public readonly navigationService = inject(NavigationService);
  public readonly authorService = inject(AuthorService);
  private readonly postService = inject(PostService);

  private readonly destroy$ = new Subject<void>();

  public currentPost = signal<PostsResponse | null | undefined>(undefined);

  public ngOnInit(): void {
    const postId = this.postId();
    if (postId) {
      this.authorService
        .getAuthors()
        .pipe(
          takeUntil(this.destroy$),
          concatMap(() =>
            this.postService.getPostById(+postId).pipe(
              tap((post: PostsResponse) => {
                this.currentPost.set(post);
              }),
            ),
          ),
        )
        .subscribe();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
