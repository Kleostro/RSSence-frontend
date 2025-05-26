import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostsListComponent, ButtonModule, RippleModule],
  selector: 'app-posts',
  styleUrl: './posts.component.scss',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);

  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);

  private loadAllPosts(query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.postsService.getAllPosts(query).pipe(
      tap((data) => {
        this.paginatedPostResponse.set(data);
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
