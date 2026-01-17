import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { map, Observable, switchMap, tap } from 'rxjs';

import { AuthorContributions } from '@/app/api/interfaces/author/author-contributions';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PostQuery } from '@/app/api/interfaces/post-query';
import { PaginatedPostResponse } from '@/app/api/schemas/post/posts-response';
import { UserResponse, UserSchema } from '@/app/api/schemas/users-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostsSettingsComponent } from '@/app/post/components/posts-settings/posts-settings.component';
import { StickyStateDirective } from '@/app/shared/directives/sticky-state/sticky-state.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostsSettingsComponent,
    AuthorInfoComponent,
    PostComponent,
    SpeedDialModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    PostsListComponent,
    StickyStateDirective,
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
  public readonly navigationService = inject(NavigationService);
  public contributionStats = signal<AuthorContributions[]>([]);
  public currentUser = signal<null | UserResponse>(null);
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);
  public postsSettingsRef = viewChild.required<PostsSettingsComponent>('posts_settings');

  private loadAuthorContributionStats(username: string, query?: PaginationQueryDto): Observable<AuthorContributions[]> {
    return this.authorsService.getAuthorContributionStats(username, query).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((data) => {
        this.contributionStats.set(data);
      }),
    );
  }

  private loadAuthorPosts(username: string, query?: PostQuery): Observable<null | PaginatedPostResponse> {
    return this.postsService.getPostsByAuthor(username, query).pipe(
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  private loadPostsInfoAndAuthor(
    username: string,
    query: Record<string, string>,
  ): Observable<{
    posts: null | PaginatedPostResponse;
    stats: AuthorContributions[];
  }> {
    return this.loadAuthorContributionStats(username, query).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((stats) =>
        this.loadAuthorPosts(username, this.navigationService.queryParams()).pipe(map((posts) => ({ posts, stats }))),
      ),
      tap(({ posts }) => {
        this.paginatedPostResponse.set(posts);
      }),
    );
  }

  public handlePageChange(event: PaginatorState): void {
    const username = this.currentUser()?.author?.username;
    if (!username) {
      return;
    }

    const { page = 0, rows } = event;
    this.navigationService.updateQueryParams({ limit: rows, page: page + 1 });
  }

  public ngOnInit(): void {
    this.navigationService.queryParams$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((query) => {
          const username = this.currentUser()?.author?.username;
          if (!username) {
            return [];
          }
          return this.loadPostsInfoAndAuthor(username, query);
        }),
      )
      .subscribe();

    this.route.data
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ user }) => {
          const result = UserSchema.safeParse(user);

          if (result.success) {
            this.currentUser.set(result.data);
            this.paginatedPostResponse.set(null);

            this.loadPostsInfoAndAuthor(
              this.currentUser()?.author?.username ?? '',
              this.navigationService.queryParams(),
            )
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe();
          }
        }),
      )
      .subscribe();
  }

  public togglePostsSettings(event: MouseEvent): void {
    event.stopPropagation();
    const ref = this.postsSettingsRef();
    ref.isOpen.set(!ref.isOpen());
  }
}
