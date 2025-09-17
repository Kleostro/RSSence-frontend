import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as marked from 'marked';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { POST_STATUS, PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import MODAL_POSITION_DIRECTION from '@/app/constants/modal-position';
import { POST_ACTION } from '@/app/constants/post-action';
import { ROLE } from '@/app/constants/roles';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import { ConfirmComponent } from '@/app/shared/components/confirm/confirm.component';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  animations: [
    trigger('postBody', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scaleY(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' }),
        animate('300ms ease-out', style({ opacity: 0, transform: 'scaleY(0)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CoauthorsListComponent,
    DatePipe,
    ButtonModule,
    RippleModule,
    PostAvatarComponent,
    PostFormComponent,
    TooltipModule,
    ConfirmComponent,
  ],
  selector: 'app-post',
  styleUrl: './post.component.scss',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(MessageService);
  private readonly postsService = inject(PostsService);
  private readonly rolesService = inject(RolesService);
  @Output() public postEvent = new EventEmitter<unknown>();
  @Output() public postFormEvent = new EventEmitter<unknown>();
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);
  public readonly sanitizer = inject(DomSanitizer);
  public readonly usersService = inject(UsersService);
  public post = input<null | PostResponse>(null);

  public canViewPostHistory = computed(() => {
    const post = this.post();
    return (
      (post?.authors.some(({ author }) => author.id === this.usersService.me()?.author?.id) ?? false) ||
      this.rolesService.hasAccess(this.usersService.me()?.roles ?? [], ROLE.MODERATOR)
    );
  });
  public canViewPostVersions = computed(() => {
    const post = this.post();
    return (
      ((post?.authors.some(
        (postAuthor) => postAuthor.authorId === this.usersService.me()?.author?.id && postAuthor.isMainAuthor,
      ) ??
        false) ||
        this.rolesService.hasAccess(this.usersService.me()?.roles ?? [], ROLE.MODERATOR)) &&
      post?.status === POST_STATUS.APPROVED
    );
  });
  public deletePostConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deletePostConfirm');
  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public isShowPostUserActions = input<boolean>(false);
  public postForm = viewChild.required<TemplateRef<PostFormComponent>>('postForm');

  public safeHtml = signal<SafeHtml>('');

  constructor() {
    if (this.navigationService.isPostDetailedPage()) {
      effect(() => {
        this.parseHtml();
      });
    }
  }

  private async parseHtml(): Promise<string> {
    const parsedHtml = await marked.parse(this.post()?.content ?? '');
    this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(parsedHtml));
    return parsedHtml;
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
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          return EMPTY;
        }),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public editPost(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER_TOP);
    this.modalService.openModal(this.postForm(), `Update post: ${this.post()?.title}`);
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

  public handlePostFormSubmit(): void {
    this.modalService.closeModal();
    this.postFormEvent.emit();
  }

  public ngOnInit(): void {
    this.parseHtml();
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
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          return EMPTY;
        }),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }
}
