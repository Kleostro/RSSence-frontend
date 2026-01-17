import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { POST_STATUS, PostResponse } from '@/app/api/schemas/post/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { handleHttpError } from '@/app/api/utils/handle-http-error';
import { POST_ACTION } from '@/app/constants/post-action';
import { ROLE } from '@/app/constants/roles';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { PostBodyComponent } from '@/app/post/components/post-body/post-body.component';
import { PostFooterComponent } from '@/app/post/components/post-footer/post-footer.component';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import { ConfirmComponent } from '@/app/shared/components/confirm/confirm.component';
import { TimeAgoPipe } from '@/app/shared/pipes/time-ago.pipe';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CoauthorsListComponent,
    TimeAgoPipe,
    ButtonModule,
    RippleModule,
    PostAvatarComponent,
    PostBodyComponent,
    PostFooterComponent,
    TooltipModule,
    ConfirmComponent,
  ],
  selector: 'app-post',
  styleUrl: './post.component.scss',
  templateUrl: './post.component.html',
})
export class PostComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(MessageService);
  private readonly postsService = inject(PostsService);
  private readonly rolesService = inject(RolesService);
  @Output() public postEvent = new EventEmitter<unknown>();
  @Output() public postFormEvent = new EventEmitter<unknown>();
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);
  public readonly usersService = inject(UsersService);
  public post = input<null | PostResponse>(null);
  public canViewPostAnalytics = computed(
    () => this.hasPostAccess(this.post()) && this.post()?.status === POST_STATUS.APPROVED,
  );
  public canViewPostHistory = computed(() => this.hasPostAccess(this.post()));
  public canViewPostVersions = computed(
    () => this.hasPostAccess(this.post()) && this.post()?.status === POST_STATUS.APPROVED,
  );
  public deletePostConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deletePostConfirm');

  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public isShowPostUserActions = input<boolean>(false);
  public isShowPostUserActionsMark = computed(
    () =>
      this.isShowPostUserActions() &&
      this.usersService.me()?.author &&
      this.usersService.me()?.author?.id === this.getAuthor()?.id,
  );
  public postForm = viewChild.required<TemplateRef<PostFormComponent>>('postForm');

  private hasPostAccess(post: null | PostResponse): boolean {
    const me = this.usersService.me();
    if (!post || !me) {
      return false;
    }

    const isAuthor = post.authors.some(({ author }) => author.id === me.author?.id);
    const isModeratorOrHigher = this.rolesService.hasAccess(me.roles, ROLE.MODERATOR);

    return isAuthor || isModeratorOrHigher;
  }

  public deletePost(): void {
    const post = this.post();
    if (!post) {
      return;
    }
    this.isProcessing.set(true);
    this.postsService
      .deletePost(post.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.modalService.closeModal();
          if (this.navigationService.isPostDetailedPage()) {
            this.navigationService.goBack();
          } else {
            this.postEvent.emit();
          }
        }),
        handleHttpError(this.message),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public getAuthor(): AuthorResponse | null {
    return this.post()?.authors.find((author) => author.isMainAuthor)?.author ?? null;
  }

  public getCoauthors(): AuthorResponse[] {
    return (
      this.post()
        ?.authors.filter((postAuthor) => !postAuthor.isMainAuthor)
        .map((postAuthor) => postAuthor.author) ?? []
    );
  }

  public isPostAuthor(): boolean {
    const meAuthor = this.usersService.me()?.author;
    if (!meAuthor) {
      return false;
    }
    return meAuthor.id === this.getAuthor()?.id;
  }

  public submitPost(): void {
    const post = this.post();
    if (!post) {
      return;
    }
    this.isProcessing.set(true);
    this.postsService
      .performPostAuthorAction(post.id, POST_ACTION.SUBMIT)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.modalService.closeModal();
          this.postEvent.emit();
        }),
        handleHttpError(this.message),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }
}
