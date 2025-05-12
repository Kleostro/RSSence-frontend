import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil, tap } from 'rxjs';

import { PostResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostService } from '@/app/post/services/post/post.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostComponent, ButtonModule, RippleModule],
  selector: 'app-post-detailed',
  styleUrl: './post-detailed.component.scss',
  templateUrl: './post-detailed.component.html',
})
export class PostDetailedComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly postService = inject(PostService);

  public readonly authorService = inject(AuthorService);
  public readonly navigationService = inject(NavigationService);

  public currentPost = signal<null | PostResponse | undefined>(undefined);
  public postId = input<null | string>(null, { alias: 'id' });

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    const postId = this.postId();
    if (postId) {
      this.postService
        .getPostById(+postId)
        .pipe(
          takeUntil(this.destroy$),
          tap((post: PostResponse) => {
            this.currentPost.set(post);
          }),
        )
        .subscribe();
    }
  }
}
