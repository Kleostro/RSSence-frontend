import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Observable, tap } from 'rxjs';

import { PostQuery } from '@/app/api/interfaces/post-query';
import { PaginatedPostResponse, POST_STATUS } from '@/app/api/schemas/post/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostsListComponent, ButtonModule, RippleModule, PostComponent],
  selector: 'app-posts',
  styleUrl: './posts.component.scss',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);

  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);

  private loadAllPosts(query?: PostQuery): Observable<null | PaginatedPostResponse> {
    return this.postsService.getAllPosts(query).pipe(
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  public handlePageChange(event: PaginatorState): void {
    const { page = 1, rows } = event;
    const query: PostQuery = {
      limit: rows,
      page: page + 1,
      status: [POST_STATUS.APPROVED],
    };

    this.loadAllPosts(query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public ngOnInit(): void {
    const query: PostQuery = { status: [POST_STATUS.APPROVED] };
    this.loadAllPosts(query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
