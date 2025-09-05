import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { TabsModule } from 'primeng/tabs';
import { Observable, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { UserResponse, UserSchema } from '@/app/api/schemas/users-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { POST_TAB } from '@/app/constants/post-tab';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostsSettingsComponent } from '@/app/post/components/posts-settings/posts-settings.component';

interface TabConfig {
  filter?: string;
  filterField?: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  [POST_TAB.ALL]: { filter: undefined, filterField: undefined },
  [POST_TAB.AUTHOR]: { filter: POST_TAB.AUTHOR, filterField: 'isMainAuthor' },
  [POST_TAB.COAUTHOR]: { filter: POST_TAB.COAUTHOR, filterField: 'isMainAuthor' },
};

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
    TabsModule,
    BadgeModule,
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
  public contributionStats = signal<{ count: number; label: string; value: string }[]>([]);
  public currentUser = signal<null | UserResponse>(null);
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);
  public selectedTab = signal<string>(POST_TAB.ALL);

  private loadAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorsService.getAuthorPosts(username, query).pipe(
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const username = this.currentUser()?.author?.username;
    if (!username) {
      return;
    }

    const { page = 1, rows } = event;

    this.postsService.query.update((q) => ({ ...q, limit: rows, page: page + 1 }));

    this.loadAuthorPosts(username, this.postsService.query()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public handleTabChange(mode: string): void {
    this.selectedTab.set(mode);

    const config = TAB_CONFIG[mode];

    this.postsService.query.update((q) => ({ ...q, ...config }));

    const username = this.currentUser()?.author?.username;
    if (!username) {
      return;
    }

    this.loadAuthorPosts(username, this.postsService.query()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public ngOnInit(): void {
    this.postsService.resetQuery();

    this.route.data
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ user }) => {
          const result = UserSchema.safeParse(user);
          if (result.success) {
            this.currentUser.set(result.data);
            this.paginatedPostResponse.set(null);
            this.authorsService
              .getAuthorContributionStats(this.currentUser()?.author?.username ?? '')
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((data) => {
                  this.contributionStats.set(data);
                }),
              )
              .subscribe();
            this.loadAuthorPosts(this.currentUser()?.author?.username ?? '', this.postsService.query())
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe();
          }
        }),
      )
      .subscribe();
  }
}
