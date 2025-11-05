import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, forkJoin, Observable, switchMap, tap } from 'rxjs';

import { PostAnalyticsQuery } from '@/app/api/interfaces/post-analytics-query';
import { PostCommentDailyStatResponse } from '@/app/api/schemas/post/post-comment-daily-stat-response';
import { PostViewDailyStatResponse } from '@/app/api/schemas/post/post-view-daily-stat-response';
import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { PostAnalyticsService } from '@/app/api/services/posts/services/post-analytics.service';
import { PostCommentsService } from '@/app/api/services/posts/services/post-comments.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
// eslint-disable-next-line max-len
import { PostCommentsAnalyticsComponent } from '@/app/post/components/post-comments-analytics/post-comments-analytics.component';
import { PostViewsAnalyticsComponent } from '@/app/post/components/post-views-analytics/post-views-analytics.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostViewsAnalyticsComponent, PostCommentsAnalyticsComponent, ButtonModule, RippleModule, TooltipModule],
  selector: 'app-post-analytics',
  styleUrl: './post-analytics.component.scss',
  templateUrl: './post-analytics.component.html',
})
export class PostAnalyticsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postAnalyticsService = inject(PostAnalyticsService);
  private readonly postCommentsService = inject(PostCommentsService);
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);
  public commentsAnalyticDataByPost = signal<null | PostCommentDailyStatResponse[]>(null);
  public currentPost = signal<null | PostResponse | undefined>(undefined);

  public postId = input<null | string>(null, { alias: 'id' });
  public viewsAnalyticDataByPost = signal<null | PostViewDailyStatResponse[]>(null);

  private getCurrentPost(): void {
    const postId = this.postId();
    if (postId) {
      this.postsService
        .getPostById(+postId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((post) => {
            this.currentPost.set(post);
          }),
          switchMap((post) => this.loadInitialPostAnalytics(post.id, this.navigationService.queryParams())),
        )
        .subscribe();
    }
  }

  private loadInitialPostAnalytics(
    postId: number,
    query?: PostAnalyticsQuery,
  ): Observable<{ comments: PostCommentDailyStatResponse[]; views: PostViewDailyStatResponse[] }> {
    return forkJoin({
      comments: this.loadPostCommentsAnalytics(postId, query),
      views: this.loadPostViewsAnalytics(postId, query),
    });
  }

  private loadPostCommentsAnalytics(
    postId: number,
    query?: PostAnalyticsQuery,
  ): Observable<PostCommentDailyStatResponse[]> {
    return this.postAnalyticsService.getPostCommentTrend(postId, query).pipe(
      tap((data) => {
        this.commentsAnalyticDataByPost.set(data);
      }),
      catchError(() => {
        this.commentsAnalyticDataByPost.set([]);
        this.viewsAnalyticDataByPost.set([]);
        return [];
      }),
    );
  }

  private loadPostViewsAnalytics(postId: number, query?: PostAnalyticsQuery): Observable<PostViewDailyStatResponse[]> {
    return this.postAnalyticsService.getPostViewsTrend(postId, query).pipe(
      tap((data) => {
        this.viewsAnalyticDataByPost.set(data);
      }),
      catchError(() => {
        this.commentsAnalyticDataByPost.set([]);
        this.viewsAnalyticDataByPost.set([]);
        return [];
      }),
    );
  }

  public ngOnInit(): void {
    this.getCurrentPost();
  }

  public redrawChart(dates: string[], type: 'comments' | 'views'): void {
    const [start, end] = dates;

    this.navigationService.updateQueryParams({ end, start });

    const query = { end, start };
    const postId = this.postId();
    if (postId) {
      switch (type) {
        case 'comments':
          this.loadPostCommentsAnalytics(+postId, query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
          break;
        case 'views':
          this.loadPostViewsAnalytics(+postId, query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
          break;
        default:
          break;
      }
    }
  }
}
