import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { AuthorFormWrapperComponent } from '@/app/author/components/author-form-wrapper/author-form-wrapper.component';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { FORM_STATE } from '@/app/author/constants/author-form';
import { getNavigationAuthorPage } from '@/app/author/constants/navigation-author-page';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { FormState } from '@/app/profile/constants/profile-form';
import MODAL_POSITION_DIRECTION from '@/app/shared/constants/modal-position';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AuthorFormWrapperComponent,
    AuthorInfoComponent,
    ButtonModule,
    RippleModule,
    PostsListComponent,
    PostFormComponent,
  ],
  selector: 'app-me-author',
  styleUrl: './me-author.component.scss',
  templateUrl: './me-author.component.html',
})
export class MeAuthorComponent implements OnDestroy, OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);
  public readonly FORM_STATE = FORM_STATE;
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);
  public authorFormState = signal<FormState>(FORM_STATE.CREATE);
  public currentAuthor = signal<AuthorResponse | null>(null);
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
  public previewAuthor = signal<AuthorResponse | null>(null);

  private loadAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorsService.getAuthorPosts(username, query).pipe(
      takeUntil(this.destroy$),
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  public deleteAuthor(): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.authorsService
      .deleteAuthor(username)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.usersService.getMe()),
      )
      .subscribe(() => {
        this.currentAuthor.set(null);
        this.previewAuthor.set(null);
        this.paginatedPostResponse.set(null);
      });
  }

  public handleAuthorFormSubmit(newOrUpdatedAuthor: AuthorResponse): void {
    this.currentAuthor.set(newOrUpdatedAuthor);
    this.previewAuthor.set(newOrUpdatedAuthor);
    this.authorFormState.set(FORM_STATE.CREATE);
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
    const { data } = this.route.snapshot;
    if ('author' in data) {
      const result = AuthorSchema.safeParse(data['author']);
      if (result.data) {
        this.currentAuthor.set(result.data);
        this.previewAuthor.set(result.data);
        this.loadAuthorPosts(result.data.username).pipe(takeUntil(this.destroy$)).subscribe();
      }
    }
  }

  public onCreatePost(): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.modalService.closeModal();

    this.loadAuthorPosts(username, { sortBy: 'createdAt', sortOrder: 'desc' })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public onPostDelete(): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.loadAuthorPosts(username).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public setParamsInModal(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER_TOP);
  }
}
