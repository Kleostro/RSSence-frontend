import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { AutoFocusModule } from 'primeng/autofocus';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize, switchMap, tap } from 'rxjs';

import { PostCommentResponse, PostCommentVoteType } from '@/app/api/schemas/post/post-comment-response';
import { PostCommentsService } from '@/app/api/services/posts/services/post-comments.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { PostCommentFormComponent } from '@/app/post/components/post-comment-form/post-comment-form.component';
import { PostCommentLoaderComponent } from '@/app/post/components/post-comment-loader/post-comment-loader.component';
import { CommentService } from '@/app/post/services/comment.service';
import { TimeAgoPipe } from '@/app/shared/pipes/time-ago.pipe';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  animations: [
    trigger('replyCollapse', [
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
    Avatar,
    RouterLink,
    AutoFocusModule,
    ButtonModule,
    RippleModule,
    PostCommentFormComponent,
    Message,
    TimeAgoPipe,
    PostCommentLoaderComponent,
    SkeletonModule,
  ],
  selector: 'app-post-comment',
  styleUrl: './post-comment.component.scss',
  templateUrl: './post-comment.component.html',
})
export class PostCommentComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postCommentsService = inject(PostCommentsService);
  public readonly commentService = inject(CommentService);
  public readonly modalService = inject(ModalService);
  public readonly usersService = inject(UsersService);
  public children = signal<PostCommentResponse[]>([]);
  public childrenCount = signal<number>(0);
  public childrenCountArray = computed(() => Array.from({ length: this.childrenCount() }, (_, i) => i));
  public comment = input.required<PostCommentResponse>();
  public commentDislikesCount = linkedSignal(() => this.comment().dislikes);
  public commentLikesCount = linkedSignal(() => this.comment().likes);
  public deleteComment = output<number>();
  public deleteCommentConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deleteCommentConfirm');
  public editComment = output<{ content: string; replyId: number }>();
  public isCommentDisliked = linkedSignal(() =>
    this.comment().commentVotes.some(
      (vote) => vote.userId === this.usersService.me()?.id && vote.voteType === PostCommentVoteType.DISLIKE,
    ),
  );
  public isCommentLiked = linkedSignal(() =>
    this.comment().commentVotes.some(
      (vote) => vote.userId === this.usersService.me()?.id && vote.voteType === PostCommentVoteType.LIKE,
    ),
  );
  public isCommentLoading = signal<boolean>(false);
  public isEditMode = signal<boolean>(false);
  public isProcessing = input<boolean>(false);
  public isRepliesShown = signal<boolean>(false);
  public isReplyFormOpen = signal<boolean>(false);

  public isReplyProcessing = signal<boolean>(false);

  public createReplyComment(comment: { content: string; parentId?: number }): void {
    this.isReplyProcessing.set(true);
    this.commentService
      .createComment(this.comment().postId, comment)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((newReply) => {
          this.children.update((children) => [...children, newReply]);
          this.isReplyFormOpen.set(false);
        }),
        switchMap(() =>
          this.postCommentsService.getCommentReplies(this.comment().id).pipe(
            tap((children) => {
              this.childrenCount.update((childrenCount) => childrenCount + 1);
              this.isRepliesShown.set(true);
              this.children.set(children);
            }),
            finalize(() => {
              this.isReplyProcessing.set(false);
            }),
          ),
        ),
      )
      .subscribe();
  }

  public deleteReplyComment(replyId: number): void {
    this.isReplyProcessing.set(true);
    this.postCommentsService
      .deleteComment(replyId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((deletedComment) => {
          const replyIndex = this.children().findIndex((child) => child.id === replyId);
          this.children.update((children) => [
            ...children.slice(0, replyIndex),
            deletedComment,
            ...children.slice(replyIndex + 1),
          ]);
        }),
        finalize(() => {
          this.isReplyProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public editReplyComment($event: { content: string; replyId: number }): void {
    this.isReplyProcessing.set(true);
    this.postCommentsService
      .updateComment($event.replyId, { content: $event.content })
      .pipe(
        tap((updatedComment) => {
          const replyIndex = this.children().findIndex((child) => child.id === $event.replyId);
          this.children.update((children) => [
            ...children.slice(0, replyIndex),
            updatedComment,
            ...children.slice(replyIndex + 1),
          ]);
        }),
        finalize(() => {
          this.isReplyProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public hideReplies(): void {
    this.isRepliesShown.set(false);
    this.children.set([]);
  }

  public ngOnInit(): void {
    this.isCommentLoading.set(true);
    this.postCommentsService
      .getCommentRepliesCount(this.comment().id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.childrenCount.set(res.count);
        }),
        finalize(() => {
          this.isCommentLoading.set(false);
        }),
      )
      .subscribe();
  }

  public onDelete(): void {
    this.isReplyProcessing.set(true);

    this.commentService
      .deleteComment(this.comment().id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.modalService.closeModal();
          this.isReplyProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public onEdit($event: { content: string }): void {
    this.isReplyProcessing.set(true);

    this.commentService
      .updateComment(this.comment().id, $event)
      .pipe(
        finalize(() => {
          this.isReplyProcessing.set(false);
          this.isEditMode.set(false);
        }),
      )
      .subscribe();
  }

  public onEditReplyComment($event: { content: string; replyId: number }): void {
    this.isEditMode.set(false);
    this.editComment.emit($event);
  }

  public onReply(): void {
    this.isReplyFormOpen.set(!this.isReplyFormOpen());
  }

  public onVote(type: PostCommentVoteType): void {
    this.isReplyProcessing.set(true);
    this.commentService
      .vote(this.comment().id, { type })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((updatedComment) => {
          if (type === PostCommentVoteType.NEUTRAL) {
            this.isCommentDisliked.set(false);
            this.isCommentLiked.set(false);
          } else if (type === PostCommentVoteType.DISLIKE) {
            this.isCommentDisliked.set(true);
            this.isCommentLiked.set(false);
          } else {
            this.isCommentDisliked.set(false);
            this.isCommentLiked.set(true);
          }
          this.commentLikesCount.set(updatedComment.likes);
          this.commentDislikesCount.set(updatedComment.dislikes);
        }),
        finalize(() => {
          this.isReplyProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public showReplies(): void {
    this.isReplyProcessing.set(true);
    this.postCommentsService
      .getCommentReplies(this.comment().id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((children) => {
          this.isRepliesShown.set(true);
          this.children.set(children);
        }),
        finalize(() => {
          this.isReplyProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public toggleReplies(): void {
    const isRepliesShown = this.isRepliesShown();
    if (!isRepliesShown) {
      this.showReplies();
    } else {
      this.hideReplies();
    }
  }
}
