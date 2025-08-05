import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PaginatorState } from 'primeng/paginator';
import { Observable, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
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
  private readonly postsService = inject(PostsService);
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);

  private loadPostsForModeration(query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.postsService.getSubmittedForModeration(query).pipe(
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const { page = 1, rows } = event;
    const query: PaginationQueryDto = { limit: rows, page: page + 1 };

    this.loadPostsForModeration(query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public handlePostEvent(): void {
    this.loadPostsForModeration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public ngOnInit(): void {
    this.loadPostsForModeration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
