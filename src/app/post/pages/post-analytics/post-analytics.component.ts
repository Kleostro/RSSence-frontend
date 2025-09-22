import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, of, switchMap, tap } from 'rxjs';

import { PostAnalyticsQuery } from '@/app/api/interfaces/post-analytics-query';
import { PostViewDailyStatResponse } from '@/app/api/schemas/post-view-daily-stat-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostViewsAnalyticsComponent } from '@/app/post/components/post-views-analytics/post-views-analytics.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostViewsAnalyticsComponent, ButtonModule, RippleModule, TooltipModule],
  selector: 'app-post-analytics',
  styleUrl: './post-analytics.component.scss',
  templateUrl: './post-analytics.component.html',
})
export class PostAnalyticsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);
  public analyticDataByPost = signal<null | PostViewDailyStatResponse[]>(null);
  public currentPost = signal<null | PostResponse | undefined>(undefined);

  public postId = input<null | string>(null, { alias: 'id' });

  public getCurrentPost(): void {
    const postId = this.postId();
    if (postId) {
      this.postsService
        .getPostById(+postId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((post) => {
            this.currentPost.set(post);
          }),
          switchMap((post) => this.loadPostAnalytics(post.id, this.navigationService.queryParams())),
        )
        .subscribe();
    }
  }

  public loadPostAnalytics(postId: number, query?: PostAnalyticsQuery): Observable<PostViewDailyStatResponse[]> {
    return this.postsService.getPostAnalytics(postId, query).pipe(
      tap((analytics) => {
        this.analyticDataByPost.set(analytics);
      }),
    );
  }

  public ngOnInit(): void {
    this.getCurrentPost();

    this.navigationService.queryParams$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((query) => {
          const postId = this.postId();
          if (postId) {
            return this.loadPostAnalytics(+postId, query);
          }
          return of([]);
        }),
      )
      .subscribe();
  }

  public redrawChart(dates: string[]): void {
    const [start, end] = dates;

    this.navigationService.updateQueryParams({ end, start });
  }
}
