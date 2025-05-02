import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { Subject, takeUntil } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostsResponse } from '@/app/api/schemas/posts-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { AuthorFormWrapperComponent } from '@/app/author/components/author-form-wrapper/author-form-wrapper.component';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { AuthorFacadeService } from '@/app/author/services/author-facade/author-facade.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostService } from '@/app/post/services/post/post.service';
import { FORM_STATE, FormState } from '@/app/profile/constants/profile-form';
import { PageLoaderComponent } from '@/app/shared/components/page-loader/page-loader.component';
import MODAL_POSITION_DIRECTION from '@/app/shared/constants/modal-position';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-author',
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
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorComponent implements OnDestroy {
  public userId = input<string | null>(null, { alias: 'id' });

  private readonly facade = inject(AuthorFacadeService);
  private readonly userService = inject(UserService);
  public readonly loaderService = inject(LoaderService);
  public readonly navigationService = inject(NavigationService);
  public readonly modalService = inject(ModalService);
  public readonly postService = inject(PostService);

  private readonly destroy$ = new Subject<void>();

  public isMyPage = signal<boolean>(false);

  public currentAuthor = signal<AuthorsResponse | null>(null);
  public authorForPreview = signal<AuthorsResponse | null>(null);

  public readonly APP_ROUTE = APP_ROUTE;
  public readonly FORM_STATE = FORM_STATE;
  public authorFormState = signal<FormState>(FORM_STATE.CREATE);

  public allAuthorsWithoutCurrent = signal<AuthorsResponse[]>([]);
  public authorPosts = signal<PostsResponse[] | null>(null);

  public navigationItems = this.facade.getNavigationItems(
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

  constructor() {
    toObservable(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId) => {
        const parsedUserId = this.navigationService.parseUserId(userId);
        this.loadInitialData(parsedUserId);
      });
  }

  private loadInitialData(userId: number | null): void {
    this.facade
      .loadInitialDataWithDependencies(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ user, authors, posts }) => {
        const me = this.userService.me();
        this.isMyPage.set(!userId || me?.id === userId);
        this.currentAuthor.set(user?.author ?? null);
        this.authorForPreview.set(user?.author ?? null);
        this.allAuthorsWithoutCurrent.set(authors);
        this.authorPosts.set(posts);
      });
  }

  public setParamsInModal(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER_TOP);
  }

  public deleteAuthor(): void {
    this.facade
      .deleteAuthor()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentAuthor.set(null);
        this.authorForPreview.set(null);
        this.authorPosts.set([]);
      });
  }

  public handleAuthorFormSubmit(newOrUpdatedAuthor: AuthorsResponse): void {
    this.currentAuthor.set(newOrUpdatedAuthor);
    this.authorForPreview.set(newOrUpdatedAuthor);
    this.authorFormState.set(FORM_STATE.CREATE);
  }

  public onCreatePost(): void {
    this.modalService.closeModal();
    const userId = this.userId();
    const parsedUserId = Number(userId) || null;
    const authorId = this.userService.me()?.author?.id;
    let action$ = null;

    if (parsedUserId === null && authorId) {
      action$ = this.postService.getPostsByAuthorId(authorId);
    } else {
      action$ = this.postService.getAllPosts();
    }

    action$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
