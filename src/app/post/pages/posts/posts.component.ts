import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { catchError, EMPTY, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PaginatedPostResponse, PaginatedPostResponseSchema } from '@/app/api/schemas/posts-response';
import { UsersResponse } from '@/app/api/schemas/users-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostService } from '@/app/post/services/post/post.service';
import { MessageService } from '@/app/shared/services/message/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostsListComponent, ButtonModule, RippleModule],
  selector: 'app-posts',
  styleUrl: './posts.component.scss',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnDestroy {
  private readonly authorService = inject(AuthorService);
  private readonly destroy$ = new Subject<void>();
  private readonly message = inject(MessageService);
  private readonly userService = inject(UserService);
  public readonly navigationService = inject(NavigationService);
  public readonly postService = inject(PostService);
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);
  public userId = input<null | string>(null, { alias: 'id' });

  constructor() {
    toObservable(this.userId)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((userId) => {
          const parsedUserId = this.navigationService.parseUserId(userId);

          if (!parsedUserId) {
            return this.loadAllPosts();
          }

          return this.loadUserData(parsedUserId).pipe(
            switchMap((user) => {
              if (!user?.author?.id) {
                return this.loadAllPosts();
              }
              return this.loadAuthorPosts(user.author.id);
            }),
          );
        }),
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private loadAllPosts(query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.postService.getAllPosts(query).pipe(
      map((response) => {
        const result = PaginatedPostResponseSchema.safeParse(response);
        this.paginatedPostResponse.set(result.data ?? null);
        return result.success ? result.data : null;
      }),
    );
  }

  private loadAuthorPosts(authorId: number, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorService.getAuthorPosts(authorId, query).pipe(
      map((response) => {
        const result = PaginatedPostResponseSchema.safeParse(response);
        this.paginatedPostResponse.set(result.data ?? null);
        return result.success ? result.data : null;
      }),
    );
  }

  private loadUserData(userId: number): Observable<null | UsersResponse> {
    const me = this.userService.me();

    if (me && me.id === userId) {
      return of(me);
    }

    return this.userService.getUserById(userId).pipe(
      map((user) => {
        if (!user?.profile) {
          this.navigationService.navigateToNotFound();
          return null;
        }
        return user;
      }),
    );
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const { page = 1, rows } = event;
    const query: PaginationQueryDto = { limit: rows, page: page + 1 };

    const userId = this.userId();
    const parsedUserId = this.navigationService.parseUserId(userId);

    if (!parsedUserId) {
      this.loadAllPosts(query).pipe(takeUntil(this.destroy$)).subscribe();
      return;
    }

    this.loadUserData(parsedUserId)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((user) => {
          if (!user?.author?.id) {
            return this.loadAllPosts(query);
          }
          return this.loadAuthorPosts(user.author.id, query);
        }),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
