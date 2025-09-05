import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { Observable, switchMap, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse, PostStatusType } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { AuthorFormWrapperComponent } from '@/app/author/components/author-form-wrapper/author-form-wrapper.component';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { FORM_STATE } from '@/app/constants/author-form';
import MODAL_POSITION_DIRECTION from '@/app/constants/modal-position';
import { getNavigationAuthorPage } from '@/app/constants/navigation-author-page';
import { FormState } from '@/app/constants/profile-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import { PostComponent } from '@/app/post/components/post/post.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostsSettingsComponent } from '@/app/post/components/posts-settings/posts-settings.component';
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
    PostsListComponent,
    PostFormComponent,
    BadgeModule,
    TabsModule,
  ],
  selector: 'app-me-author',
  styleUrl: './me-author.component.scss',
  templateUrl: './me-author.component.html',
})
export class MeAuthorComponent implements OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
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
  public paginatedPostResponseOnTab = signal<null | PaginatedPostResponse>(null);
  public postStatuses = signal<{ count: number; name: string }[]>([]);
  public previewAuthor = signal<AuthorResponse | null>(null);
  public selectedTab = signal<string>('');

  private loadAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorsService.getAuthorPosts(username, query).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((data) => {
        this.paginatedPostResponse.set(data);
      }),
    );
  }

  private loadAuthorPostStatuses(username: string): Observable<{ count: number; name: string }[]> {
    return this.authorsService.getAuthorPostStatuses(username).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((data) => {
        this.postStatuses.set(data);
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
        takeUntilDestroyed(this.destroyRef),
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
    this.loadAuthorPosts(newOrUpdatedAuthor.username).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    const { page = 1, rows } = event;
    this.postsService.query.set({ ...this.postsService.query(), limit: rows, page: page + 1 });

    this.loadAuthorPostStatuses(username)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.loadAuthorPosts(username, this.postsService.query())),
      )
      .subscribe();
  }

  public handlePostEvent(): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.loadAuthorPostStatuses(username)
      .pipe(
        tap((data) => {
          const firstTab = data[0]?.name ?? null;
          this.selectedTab.set(firstTab);
          this.postsService.query.set({
            filter: this.selectedTab(),
            filterField: firstTab ? 'status' : undefined,
          });
        }),
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.loadAuthorPosts(username, this.postsService.query())),
      )
      .subscribe();
  }

  public handleTabChange(status: string): void {
    this.selectedTab.set(status);
    this.postsService.query.set({ ...this.postsService.query(), filter: status, filterField: 'status' });
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.loadAuthorPostStatuses(username)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.loadAuthorPosts(username, this.postsService.query())),
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this.postsService.resetQuery();

    this.route.data
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ author }) => {
          const result = AuthorSchema.safeParse(author);
          if (result.success) {
            this.currentAuthor.set(result.data);
            this.previewAuthor.set(result.data);
            this.paginatedPostResponse.set(null);

            this.loadAuthorPostStatuses(result.data.username)
              .pipe(
                tap((data) => {
                  const firstTab = data[0]?.name ?? null;
                  this.selectedTab.set(firstTab);
                  this.postsService.query.set({
                    filter: this.selectedTab(),
                    filterField: firstTab ? 'status' : undefined,
                  });
                }),
                takeUntilDestroyed(this.destroyRef),
                switchMap(() => this.loadAuthorPosts(result.data.username, this.postsService.query())),
              )
              .subscribe();
          }
        }),
      )
      .subscribe();
  }

  public onCreatePost(postStatus: PostStatusType): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    this.modalService.closeModal();
    this.selectedTab.set(postStatus);

    this.postsService.query.set({
      ...this.postsService.query(),
      filter: postStatus,
      filterField: 'status',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    this.loadAuthorPostStatuses(username).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.loadAuthorPosts(username, this.postsService.query()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public setParamsInModal(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER);
  }
}
