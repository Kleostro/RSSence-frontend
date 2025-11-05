import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PART } from '@/app/api/constants/parts';
import { POST_QUERY_KEYS, PostQuery } from '@/app/api/interfaces/post-query';
import { ModerationHistoryResponse } from '@/app/api/schemas/moderation-history-response';
import {
  PaginatedPostResponse,
  PaginatedPostResponseSchema,
  PostResponse,
} from '@/app/api/schemas/post/posts-response';
import { buildApiUrl } from '@/app/api/utils/build-api-url';
import { NewPost } from '@/app/interfaces/post-form';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';
import { buildHttpParams } from '@/app/utils/http-params';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly message = inject(MessageService);

  public createPost(post: NewPost): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS);
    return this.http.post<PostResponse>(url, post).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_POST_SUCCESS);
      }),
    );
  }

  public deletePost(postId: number): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString());
    return this.http.delete<PostResponse>(url).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_POST_SUCCESS);
      }),
    );
  }

  public getAllPosts(query?: PostQuery): Observable<null | PaginatedPostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS);
    return this.http
      .get<PaginatedPostResponse>(url, {
        params: { ...query },
      })
      .pipe(
        map((response: PaginatedPostResponse) => {
          const { data, success } = PaginatedPostResponseSchema.safeParse(response);
          return success ? data : null;
        }),
      );
  }

  public getPostById(postId: number): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, PART.ID, postId.toString());
    return this.http.get<PostResponse>(url);
  }

  public getPostBySlug(slug: string): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, slug);
    return this.http.get<PostResponse>(url);
  }

  public getPostModerationHistory(postId: number): Observable<ModerationHistoryResponse[]> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.HISTORY);
    return this.http.get<ModerationHistoryResponse[]>(url);
  }

  public getPostsByAuthor(username: string, query?: PostQuery): Observable<null | PaginatedPostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, username, PART.POSTS);
    const params = query ? buildHttpParams(query, POST_QUERY_KEYS) : new HttpParams();
    return this.http.get<PaginatedPostResponse>(url, { params }).pipe(
      map((response: PaginatedPostResponse) => {
        const { data, success } = PaginatedPostResponseSchema.safeParse(response);
        return success ? data : null;
      }),
    );
  }

  public performPostAuthorAction(postId: number, action: string): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.MODERATION);
    return this.http.patch<PostResponse>(url, { action }).pipe(
      tap(() => {
        this.message.info(MESSAGE.APPROVE_POST_SUCCESS);
      }),
    );
  }

  public performPostModeratorAction(
    postId: number,
    action: string,
    comment?: string,
    reasons?: string[],
  ): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.MODERATION, PART.MODERATOR);
    return this.http.patch<PostResponse>(url, { action, comment, reasons }).pipe(
      tap(() => {
        this.message.info(MESSAGE.APPROVE_POST_SUCCESS);
      }),
    );
  }

  public updatePost(postId: number, post: NewPost): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString());
    return this.http.patch<PostResponse>(url, post).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_POST_SUCCESS);
      }),
    );
  }
}
