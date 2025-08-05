/* eslint-disable max-len */
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { tap } from 'rxjs';

import { ModerationHistoryResponse } from '@/app/api/schemas/moderation-history-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostHistoryTimelineComponent } from '@/app/post/components/post-history-timeline/post-history-timeline.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostHistoryTimelineComponent, ButtonModule, RippleModule],
  selector: 'app-post-history',
  styleUrl: './post-history.component.scss',
  templateUrl: './post-history.component.html',
})
export class PostHistoryComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);

  public currentHistory = signal<ModerationHistoryResponse[] | null | undefined>(undefined);
  public postId = input<null | string>(null, { alias: 'id' });

  public getCurrentPost(): void {
    const postId = this.postId();
    if (postId) {
      this.postsService
        .getPostModerationHistory(+postId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((history: ModerationHistoryResponse[]) => {
            this.currentHistory.set(history);
          }),
        )
        .subscribe();
    }
  }

  public ngOnInit(): void {
    this.getCurrentPost();
  }
}
