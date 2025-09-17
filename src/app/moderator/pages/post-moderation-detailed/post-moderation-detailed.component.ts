import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { tap } from 'rxjs';

import { PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ModerationPostComponent } from '@/app/moderator/components/moderation-post/moderation-post.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, RippleModule, ModerationPostComponent],
  selector: 'app-post-moderation-detailed',
  styleUrl: './post-moderation-detailed.component.scss',
  templateUrl: './post-moderation-detailed.component.html',
})
export class PostModerationDetailedComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);

  public currentPost = signal<null | PostResponse | undefined>(undefined);
  public postSlug = input<null | string>(null, { alias: 'id' });

  public getCurrentPost(): void {
    const postSlug = this.postSlug();
    if (postSlug) {
      this.postsService
        .getPostBySlug(postSlug)
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
