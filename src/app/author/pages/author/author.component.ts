import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { Subject, takeUntil } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
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
  private readonly destroy$ = new Subject<void>();
  private readonly facade = inject(AuthorFacadeService);
  private readonly userService = inject(UserService);

  public readonly APP_ROUTE = APP_ROUTE;
  public readonly FORM_STATE = FORM_STATE;
  public readonly loaderService = inject(LoaderService);
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);
  public readonly postService = inject(PostService);

  public allAuthorsWithoutCurrent = signal<AuthorsResponse[]>([]);
  public authorFormState = signal<FormState>(FORM_STATE.CREATE);
  public authorForPreview = signal<AuthorsResponse | null>(null);
  public authorPosts = signal<null | PostResponse[]>(null);
  public currentAuthor = signal<AuthorsResponse | null>(null);
  public isMyPage = signal<boolean>(false);
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
  public userId = input<null | string>(null, { alias: 'id' });

  constructor() {
    toObservable(this.userId)
      .pipe(takeUntil(this.destroy$))

      .subscribe((userId) => {
        const parsedUserId = this.navigationService.parseUserId(userId);
        this.loadInitialData(parsedUserId);
      });
  }

  private loadInitialData(userId: null | number): void {
    this.facade
      .loadInitialDataWithDependencies(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ authors, posts, user }) => {
        const me = this.userService.me();
        this.isMyPage.set(!userId || me?.id === userId);
        this.currentAuthor.set(user?.author ?? null);
        this.authorForPreview.set(user?.author ?? null);
        this.allAuthorsWithoutCurrent.set(authors);
        this.authorPosts.set(posts);
      });
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  public setParamsInModal(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER_TOP);
  }
}
