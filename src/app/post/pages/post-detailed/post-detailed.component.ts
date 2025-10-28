import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { finalize, switchMap, tap } from 'rxjs';

import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostCommentFormComponent } from '@/app/post/components/post-comment-form/post-comment-form.component';
import { PostCommentsListComponent } from '@/app/post/components/post-comments-list/post-comments-list.component';
import { PostComponent } from '@/app/post/components/post/post.component';
import { CommentService } from '@/app/post/services/comment.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostComponent,
    ButtonModule,
    RippleModule,
    PostCommentFormComponent,
    PostCommentsListComponent,
    MessageModule,
  ],
  selector: 'app-post-detailed',
  styleUrl: './post-detailed.component.scss',
  templateUrl: './post-detailed.component.html',
})
export class PostDetailedComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  public readonly commentService = inject(CommentService);
  public readonly navigationService = inject(NavigationService);
  public readonly usersService = inject(UsersService);
  public currentPost = signal<null | PostResponse | undefined>(undefined);
  public isProcessing = signal<boolean>(false);

  public postSlug = input<null | string>(null, { alias: 'id' });

  public createComment(comment: { content: string; parentId?: number }): void {
    this.isProcessing.set(true);
    const postId = this.currentPost()?.id;
    if (!postId) {
      return;
    }
    this.commentService
      .createComment(postId, comment)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          this.commentService.loadCommentsByPostId(postId, { ...this.navigationService.queryParams(), page: 1 }).pipe(
            finalize(() => {
              this.isProcessing.set(false);
            }),
          ),
        ),
      )
      .subscribe();
  }

  public getCurrentPost(): void {
    const postSlug = this.postSlug();
    if (postSlug) {
      this.postsService
        .getPostBySlug(postSlug)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((post) => {
            this.currentPost.set(post);
          }),
          switchMap((post) => this.commentService.loadCommentsByPostId(post.id, this.navigationService.queryParams())),
        )
        .subscribe();
    }
  }

  public handlePageChange(event: PaginatorState): void {
    const { page = 0, rows } = event;
    this.navigationService.updateQueryParams({ limit: rows, page: page + 1 });
  }

  public ngOnInit(): void {
    this.getCurrentPost();

    this.navigationService.queryParams$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((query) => {
          const postId = this.currentPost()?.id;
          if (!postId) {
            return [];
          }
          return this.commentService.loadCommentsByPostId(postId, query);
        }),
      )
      .subscribe();
  }
}
