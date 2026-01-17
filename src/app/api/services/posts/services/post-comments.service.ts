import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PART } from '@/app/api/constants/parts';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import {
  PaginatedPostCommentResponse,
  PostCommentResponse,
  PostCommentVoteType,
} from '@/app/api/schemas/post/post-comment-response';
import { buildApiUrl } from '@/app/api/utils/build-api-url';

@Injectable({
  providedIn: 'root',
})
export class PostCommentsService {
  private readonly http = inject(HttpClient);

  public createComment(postId: number, body: { content: string; parentId?: number }): Observable<PostCommentResponse> {
    const url = buildApiUrl(ENDPOINTS.COMMENTS, PART.POST, postId.toString());
    return this.http.post<PostCommentResponse>(url, body);
  }

  public deleteComment(commentId: number): Observable<PostCommentResponse> {
    const url = buildApiUrl(ENDPOINTS.COMMENTS, commentId.toString());
    return this.http.delete<PostCommentResponse>(url);
  }

  public getCommentReplies(parentId: number): Observable<PostCommentResponse[]> {
    const url = buildApiUrl(ENDPOINTS.COMMENTS, parentId.toString(), PART.CHILDREN);
    return this.http.get<PostCommentResponse[]>(url);
  }

  public getCommentsByPostId(postId: number, query?: PaginationQueryDto): Observable<PaginatedPostCommentResponse> {
    const url = buildApiUrl(ENDPOINTS.COMMENTS, PART.POST, postId.toString());
    return this.http.get<PaginatedPostCommentResponse>(url, {
      params: { ...query },
    });
  }

  public updateComment(commentId: number, body: { content: string }): Observable<PostCommentResponse> {
    const url = buildApiUrl(ENDPOINTS.COMMENTS, commentId.toString());
    return this.http.patch<PostCommentResponse>(url, body);
  }

  public vote(commentId: number, body: { type: PostCommentVoteType }): Observable<PostCommentResponse> {
    const url = buildApiUrl(ENDPOINTS.COMMENTS, commentId.toString(), PART.VOTE);
    return this.http.post<PostCommentResponse>(url, body);
  }
}
