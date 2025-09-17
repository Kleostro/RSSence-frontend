import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { marked } from 'marked';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { POST_ACTION } from '@/app/constants/post-action';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { PostRejectComponent } from '@/app/post/components/post-reject/post-reject.component';
import { PostRevisionComponent } from '@/app/post/components/post-revision/post-revision.component';
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
    PostRejectComponent,
    PostRevisionComponent,
    TooltipModule,
  ],
  selector: 'app-moderation-post',
  styleUrl: './moderation-post.component.scss',
  templateUrl: './moderation-post.component.html',
})
export class ModerationPostComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(MessageService);
  private readonly postsService = inject(PostsService);
  @Output() public postEvent = new EventEmitter<unknown>();
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);
  public readonly sanitizer = inject(DomSanitizer);
  public readonly usersService = inject(UsersService);
  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public isShowPostModeratorActions = input<boolean>(false);
  public post = input.required<null | PostResponse>();
  public rejectPostConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('rejectPostConfirm');

  public revisionPostConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('revisionPostConfirm');

  public safeHtml = signal<SafeHtml>('');

  constructor() {
    if (this.navigationService.isPostDetailedModerationPage()) {
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

  public approvePost(): void {
    const post = this.post();
    if (!post) {
      return;
    }
    this.isProcessing.set(true);
    this.postsService
      .performPostModeratorAction(post.id, POST_ACTION.APPROVE)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          if (this.navigationService.isPostDetailedModerationPage()) {
            this.navigationService.navigateToPostModeration();
          }
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
}
