import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { finalize, forkJoin, map, Observable, switchMap, tap } from 'rxjs';

import { AuthorContributions } from '@/app/api/interfaces/author/author-contributions';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PostQuery } from '@/app/api/interfaces/post-query';
import { PostStatuses } from '@/app/api/interfaces/post/post-statuses';
import { AuthorResponse, AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse } from '@/app/api/schemas/post/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { AuthorFormWrapperComponent } from '@/app/author/components/author-form-wrapper/author-form-wrapper.component';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { FORM_STATE } from '@/app/constants/form/author-form';
import { FormState } from '@/app/constants/form/profile-form';
import { getNavigationAuthorPage } from '@/app/constants/navigation-author-page';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostsSettingsComponent } from '@/app/post/components/posts-settings/posts-settings.component';
import { ConfirmComponent } from '@/app/shared/components/confirm/confirm.component';
import { StickyStateDirective } from '@/app/shared/directives/sticky-state/sticky-state.directive';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostsSettingsComponent,
    AuthorFormWrapperComponent,
    AuthorInfoComponent,
    ButtonModule,
    PostComponent,
    RippleModule,
    StickyStateDirective,
    PostsListComponent,
    ConfirmComponent,
  ],
  selector: 'app-me-author',
  styleUrl: './me-author.component.scss',
  templateUrl: './me-author.component.html',
})
export class MeAuthorComponent implements OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalService = inject(ModalService);
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);
  public readonly FORM_STATE = FORM_STATE;
  public readonly navigationService = inject(NavigationService);
  public authorFormState = signal<FormState>(FORM_STATE.CREATE);
  public contributionStats = signal<AuthorContributions[]>([]);
  public currentAuthor = signal<AuthorResponse | null>(null);
  public deleteAuthorConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deleteAuthorConfirm');
  public isProcessing = signal<boolean>(false);
  public navigationItems = getNavigationAuthorPage(
    () => {
      this.navigationService.navigateToProfile();
    },
    () => {
      this.authorFormState.set(FORM_STATE.UPDATE);
    },
    () => {
      this.modalService.openModal(this.deleteAuthorConfirm(), 'Deleting an author');
      this.modalService.contentWidth.set('50%');
    },
  );
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);
  public paginatedPostResponseOnTab = signal<null | PaginatedPostResponse>(null);
  public postsSettingsRef = viewChild.required<PostsSettingsComponent>('postsSettings');
  public postStatuses = signal<PostStatuses[]>([]);

  public previewAuthor = signal<AuthorResponse | null>(null);

  private loadAuthorContributionStats(username: string, query?: PaginationQueryDto): Observable<AuthorContributions[]> {
    return this.authorsService.getAuthorContributionStats(username, query).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((data) => {
        this.contributionStats.set(data);
      }),
    );
  }

  private loadAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.postsService.getPostsByAuthor(username, query).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  private loadAuthorPostStatuses(username: string, query?: PostQuery): Observable<PostStatuses[]> {
    return this.authorsService.getAuthorPostStatuses(username, query).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((data) => {
        this.postStatuses.set(data);
      }),
    );
  }

  private loadPostsInfoAndAuthor(
    username: string,
    query: Record<string, string>,
  ): Observable<{
    posts: null | PaginatedPostResponse;
    postStatuses: PostStatuses[];
    stats: AuthorContributions[];
  }> {
    return forkJoin({
      postStatuses: this.loadAuthorPostStatuses(username, query),
      stats: this.loadAuthorContributionStats(username, query),
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(({ postStatuses, stats }) => {
        return this.loadAuthorPosts(username, this.navigationService.queryParams()).pipe(
          map((posts) => ({ posts, postStatuses, stats })),
        );
      }),
      tap(({ posts }) => {
        this.paginatedPostResponse.set(posts);
      }),
    );
  }

  public deleteAuthor(): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.isProcessing.set(true);
    this.authorsService
      .deleteAuthor(username)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.usersService.getMe()),
        finalize(() => {
          this.isProcessing.set(false);
        }),
        map(() => {
          this.currentAuthor.set(null);
          this.previewAuthor.set(null);
          this.paginatedPostResponse.set(null);
          this.modalService.closeModal();
        }),
      )
      .subscribe();
  }

  public handleAuthorFormSubmit(newOrUpdatedAuthor: AuthorResponse): void {
    this.currentAuthor.set(newOrUpdatedAuthor);
    this.previewAuthor.set(newOrUpdatedAuthor);
    this.authorFormState.set(FORM_STATE.CREATE);
    this.loadAuthorPosts(newOrUpdatedAuthor.username, this.navigationService.queryParams())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public handlePageChange(event: PaginatorState): void {
    const { page = 0, rows } = event;
    this.navigationService.updateQueryParams({ limit: rows, page: page + 1 });
  }

  public handlePostEvent(): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.navigationService.updateQueryParams({ status: [this.postStatuses()[0].name] });

    this.loadPostsInfoAndAuthor(username, this.navigationService.queryParams())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public ngOnInit(): void {
    this.navigationService.queryParams$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((query) => {
          const username = this.currentAuthor()?.username;
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
        tap(({ author }) => {
          const result = AuthorSchema.safeParse(author);
          if (result.success) {
            this.currentAuthor.set(result.data);
            this.previewAuthor.set(result.data);
            this.paginatedPostResponse.set(null);

            this.loadPostsInfoAndAuthor(result.data.username, this.navigationService.queryParams())
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
