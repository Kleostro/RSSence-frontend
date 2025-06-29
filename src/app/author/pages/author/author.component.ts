import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import { SpeedDialModule } from 'primeng/speeddial';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostsSettingsComponent } from '@/app/post/components/posts-settings/posts-settings.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostsSettingsComponent,
    AuthorInfoComponent,
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
export class AuthorComponent implements OnDestroy, OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly destroy$ = new Subject<void>();
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
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.postsService.resetQuery();
    const { data } = this.route.snapshot;
    if ('author' in data) {
      const result = AuthorSchema.safeParse(data['author']);
      if (result.data) {
        this.currentAuthor.set(result.data);
        this.postsQuery$
          .pipe(
            takeUntil(this.destroy$),
            tap((query) => {
              this.paginatedPostResponse.set(null);
              this.loadAuthorPosts(result.data.username, query).pipe(takeUntil(this.destroy$)).subscribe();
            }),
          )
          .subscribe();
      }
    }
  }
}
