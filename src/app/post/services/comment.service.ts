import { inject, Injectable, signal } from '@angular/core';

import { finalize, Observable, switchMap, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import {
  PaginatedPostCommentResponse,
  PostCommentResponse,
  PostCommentVoteType,
} from '@/app/api/schemas/post/post-comment-response';
import { PostCommentsService } from '@/app/api/services/posts/services/post-comments.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly navigationService = inject(NavigationService);
  private readonly postCommentsService = inject(PostCommentsService);
  public currentPostCommentResponse = signal<null | PaginatedPostCommentResponse>(null);
  public isLoading = signal<boolean>(false);

  public createComment(
    postId: number,
    comment: { content: string; parentId?: number },
  ): Observable<PostCommentResponse> {
    return this.postCommentsService.createComment(postId, comment);
  }

  public deleteComment(commentId: number): Observable<PaginatedPostCommentResponse> {
    return this.postCommentsService
      .deleteComment(commentId)
      .pipe(
        switchMap((deletedComment) =>
          this.loadCommentsByPostId(deletedComment.postId, this.navigationService.queryParams()),
        ),
      );
  }

  public loadCommentsByPostId(postId: number, query?: PaginationQueryDto): Observable<PaginatedPostCommentResponse> {
    this.isLoading.set(true);

    return this.postCommentsService.getCommentsByPostId(postId, query).pipe(
      tap((res) => {
        this.currentPostCommentResponse.set(res);
      }),
      finalize(() => {
        this.isLoading.set(false);
      }),
    );
  }

  public updateComment(commentId: number, comment: { content: string }): Observable<PaginatedPostCommentResponse> {
    return this.postCommentsService
      .updateComment(commentId, comment)
      .pipe(
        switchMap((updatedComment) =>
          this.loadCommentsByPostId(updatedComment.postId, this.navigationService.queryParams()),
        ),
      );
  }

  public vote(commentId: number, body: { type: PostCommentVoteType }): Observable<PostCommentResponse> {
    return this.postCommentsService.vote(commentId, body);
  }
}
