import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { tap } from 'rxjs';

import { PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostComponent, ButtonModule, RippleModule],
  selector: 'app-post-detailed',
  styleUrl: './post-detailed.component.scss',
  templateUrl: './post-detailed.component.html',
})
export class PostDetailedComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);

  public currentPost = signal<null | PostResponse | undefined>(undefined);
  public postId = input<null | string>(null, { alias: 'id' });

  public getCurrentPost(): void {
    const postId = this.postId();
    if (postId) {
      this.postsService
        .getPostById(+postId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((post: PostResponse) => {
            this.currentPost.set(post);
          }),
        )
        .subscribe();
    }
  }

  public ngOnInit(): void {
    this.getCurrentPost();
  }
}
