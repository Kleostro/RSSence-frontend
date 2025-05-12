import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { catchError, EMPTY, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PaginatedPostResponse, PaginatedPostResponseSchema } from '@/app/api/schemas/posts-response';
import { UsersResponse } from '@/app/api/schemas/users-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { AuthorFormWrapperComponent } from '@/app/author/components/author-form-wrapper/author-form-wrapper.component';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { getNavigationAuthorPage } from '@/app/author/constants/navigation-author-page';
import { AuthorService } from '@/app/author/services/author/author.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { FORM_STATE, FormState } from '@/app/profile/constants/profile-form';
import { PageLoaderComponent } from '@/app/shared/components/page-loader/page-loader.component';
import MODAL_POSITION_DIRECTION from '@/app/shared/constants/modal-position';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AuthorInfoComponent,
    AuthorFormWrapperComponent,
    PageLoaderComponent,
    SpeedDialModule,
    PostFormComponent,
    ButtonModule,
    RippleModule,
    PostsListComponent,
    RouterLink,
    NgIf,
  ],
  selector: 'app-author',
  styleUrl: './author.component.scss',
  templateUrl: './author.component.html',
})
export class AuthorComponent implements OnDestroy {
  private readonly authorService = inject(AuthorService);
  private readonly destroy$ = new Subject<void>();
  private readonly message = inject(MessageService);
  private readonly userService = inject(UserService);
  public readonly APP_ROUTE = APP_ROUTE;
  public readonly FORM_STATE = FORM_STATE;
  public readonly loaderService = inject(LoaderService);
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);

  public authorFormState = signal<FormState>(FORM_STATE.CREATE);
  public authorForPreview = signal<AuthorResponse | null>(null);
  public currentAuthor = signal<AuthorResponse | null>(null);
  public isMyPage = signal<boolean>(false);
  public navigationItems = getNavigationAuthorPage(
    () => {
      this.navigationService.navigateToProfile();
    },
    () => {
      this.authorFormState.set(FORM_STATE.UPDATE);
    },
    () => {
      this.deleteAuthor();
    },
  );
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);
  public userId = input<null | string>(null, { alias: 'id' });

  constructor() {
    toObservable(this.userId)
      .pipe(
        takeUntil(this.destroy$),
        map((userId) => this.navigationService.parseUserId(userId)),
        switchMap((parsedUserId) => this.handleUserLoad(parsedUserId)),
        tap((user) => {
          this.currentAuthor.set(user?.author ?? null);
          this.authorForPreview.set(user?.author ?? null);
        }),
        switchMap((user) => {
          if (!user?.author?.id) {
            return of({ paginatedPostResponse: null });
          }
          return this.loadAuthorPosts(user.author.id);
        }),

        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private handleUserLoad(userId: null | number): Observable<null | UsersResponse> {
    const me = this.userService.me();
    if (!userId) {
      this.isMyPage.set(true);
      return of(me ?? null);
    }
    if (me?.id === userId) {
      this.isMyPage.set(true);
      return of(me);
    }
    this.isMyPage.set(false);
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

  private loadAuthorPosts(authorId: number, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorService.getAuthorPosts(authorId, query).pipe(
      map((response) => {
        const result = PaginatedPostResponseSchema.safeParse(response);
        this.paginatedPostResponse.set(result.data ?? null);
        return result.success ? result.data : null;
      }),
    );
  }

  public deleteAuthor(): void {
    this.authorService
      .deleteAuthor()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentAuthor.set(null);
        this.authorForPreview.set(null);
        this.paginatedPostResponse.set(null);
      });
  }

  public handleAuthorFormSubmit(newOrUpdatedAuthor: AuthorResponse): void {
    this.currentAuthor.set(newOrUpdatedAuthor);
    this.authorForPreview.set(newOrUpdatedAuthor);
    this.authorFormState.set(FORM_STATE.CREATE);
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const authorId = this.currentAuthor()?.id;
    if (!authorId) {
      return;
    }

    const { page = 1, rows } = event;

    this.loadAuthorPosts(authorId, { limit: rows, page: page + 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onCreatePost(): void {
    const authorId = this.currentAuthor()?.id;
    if (!authorId) {
      return;
    }

    this.modalService.closeModal();

    this.loadAuthorPosts(authorId, { sortBy: 'createdAt', sortOrder: 'desc' })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public setParamsInModal(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER_TOP);
  }
}
