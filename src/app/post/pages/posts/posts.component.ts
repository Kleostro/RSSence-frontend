import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { map, Observable, Subject, takeUntil } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedPostResponse, PaginatedPostResponseSchema } from '@/app/api/schemas/posts-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostService } from '@/app/post/services/post/post.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostsListComponent, ButtonModule, RippleModule],
  selector: 'app-posts',
  styleUrl: './posts.component.scss',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  public readonly navigationService = inject(NavigationService);
  public readonly postService = inject(PostService);

  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);

  private loadAllPosts(query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.postService.getAllPosts(query).pipe(
      map((response) => {
        const result = PaginatedPostResponseSchema.safeParse(response);
        this.paginatedPostResponse.set(result.data ?? null);
        return result.success ? result.data : null;
      }),
    );
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const { page = 1, rows } = event;
    const query: PaginationQueryDto = { limit: rows, page: page + 1 };

    this.loadAllPosts(query).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.loadAllPosts().pipe(takeUntil(this.destroy$)).subscribe();
  }
}
