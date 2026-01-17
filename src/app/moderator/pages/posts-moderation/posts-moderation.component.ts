import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PaginatorState } from 'primeng/paginator';
import { Observable, tap } from 'rxjs';

import { PostQuery } from '@/app/api/interfaces/post-query';
import { PaginatedPostResponse, POST_STATUS } from '@/app/api/schemas/post/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ModerationPostComponent } from '@/app/moderator/components/moderation-post/moderation-post.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostsListComponent, ModerationPostComponent],
  selector: 'app-posts-moderation',
  styleUrl: './posts-moderation.component.scss',
  templateUrl: './posts-moderation.component.html',
})
export class PostsModerationComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigationService = inject(NavigationService);
  private readonly postsService = inject(PostsService);
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);

  private loadPostsForModeration(query?: PostQuery): Observable<null | PaginatedPostResponse> {
    return this.postsService.getAllPosts(query).pipe(
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  public handlePageChange(event: PaginatorState): void {
    const { page = 1, rows } = event;

    this.navigationService.updateQueryParams({ limit: rows, page: page + 1 });

    this.loadPostsForModeration(this.navigationService.queryParams())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public ngOnInit(): void {
    this.navigationService.updateQueryParams({ status: [POST_STATUS.SUBMITTED] });

    this.loadPostsForModeration({ status: [POST_STATUS.SUBMITTED] })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
