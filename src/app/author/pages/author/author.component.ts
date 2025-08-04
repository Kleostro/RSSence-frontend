import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import { SpeedDialModule } from 'primeng/speeddial';
import { Observable, switchMap, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse, POST_STATUS } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostsSettingsComponent } from '@/app/post/components/posts-settings/posts-settings.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostsSettingsComponent,
    AuthorInfoComponent,
    PostComponent,
    SpeedDialModule,
    ButtonModule,
    RippleModule,
    PostsListComponent,
    Skeleton,
  ],
  selector: 'app-author',
  styleUrl: './author.component.scss',
  templateUrl: './author.component.html',
})
export class AuthorComponent implements OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private postsQuery$: Observable<PaginationQueryDto> = toObservable(this.postsService.query);
  public readonly navigationService = inject(NavigationService);
  public currentAuthor = signal<AuthorResponse | null>(null);
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);

  private loadAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorsService.getAuthorPosts(username, query).pipe(
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    const { page = 1, rows } = event;

    this.loadAuthorPosts(username, { limit: rows, page: page + 1 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public ngOnInit(): void {
    this.postsService.resetQuery();
    this.postsService.query.set({ filter: POST_STATUS.APPROVED, filterField: 'status' });

    this.route.data
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ author }) => {
          const result = AuthorSchema.safeParse(author);
          if (result.success) {
            this.currentAuthor.set(result.data);
            this.paginatedPostResponse.set(null);
            this.loadAuthorPosts(result.data.username, this.postsService.query())
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe();
          }
        }),
      )
      .subscribe();

    this.postsQuery$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((query) => {
          const username = this.currentAuthor()?.username;
          if (!username) {
            return [];
          }

          return this.loadAuthorPosts(username, query);
        }),
      )
      .subscribe();
  }
}
