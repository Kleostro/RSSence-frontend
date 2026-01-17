import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';

import { PostVersionDiffResponse } from '@/app/api/schemas/post/post-version-diff-response';
import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { PostVersionsService } from '@/app/api/services/posts/services/post-versions.service';
import { handleHttpError } from '@/app/api/utils/handle-http-error';
import { POST_ACTION } from '@/app/constants/post-action';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostRejectComponent } from '@/app/post/components/post-reject/post-reject.component';
import { PostRevisionComponent } from '@/app/post/components/post-revision/post-revision.component';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  animations: [
    trigger('boxCollapse', [
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
    ButtonModule,
    RippleModule,
    ButtonModule,
    RippleModule,
    PostRejectComponent,
    PostRevisionComponent,
    TooltipModule,
  ],
  selector: 'app-post-review',
  styleUrl: './post-review.component.scss',
  templateUrl: './post-review.component.html',
})
export class PostReviewComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(MessageService);
  private readonly postsService = inject(PostsService);
  private readonly postsVersionsService = inject(PostVersionsService);
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);
  public collapsedBoxes = signal<Set<string>>(new Set());
  public currentPost = signal<null | PostResponse | undefined>(undefined);
  public currentPostVersionDiff = signal<null | PostVersionDiffResponse>(null);

  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public isShowPostModeratorActions = input<boolean>(false);
  public postId = input<null | string>(null, { alias: 'id' });
  public rejectPostConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('rejectPostConfirm');
  public revisionPostConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('revisionPostConfirm');

  private getCurrentPost(): void {
    const postId = this.postId();
    if (postId) {
      this.postsService
        .getPostById(+postId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          switchMap((post: PostResponse) => {
            this.currentPost.set(post);
            return this.postsVersionsService.getVersionDiffForPostReview(+postId).pipe(
              tap((versions) => {
                this.currentPostVersionDiff.set(versions);
              }),
            );
          }),
          catchError(() => {
            this.navigationService.navigateToNotFound();
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  public approvePost(): void {
    const post = this.currentPost();
    if (!post) {
      return;
    }
    this.isProcessing.set(true);
    this.postsService
      .performPostModeratorAction(post.id, POST_ACTION.APPROVE)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.navigationService.navigateToPostModeration();
        }),
        handleHttpError(this.message),

        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public isBoxCollapsed(boxId: string): boolean {
    return this.collapsedBoxes().has(boxId);
  }

  public ngOnInit(): void {
    this.getCurrentPost();
  }

  public toggleBox(boxId: string): void {
    const current = this.collapsedBoxes();
    const updated = new Set(current);

    if (updated.has(boxId)) {
      updated.delete(boxId);
    } else {
      updated.add(boxId);
    }

    this.collapsedBoxes.set(updated);
  }
}
