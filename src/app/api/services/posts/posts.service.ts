/* eslint-disable max-len */
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { POST_QUERY_KEYS, PostQuery } from '@/app/api/interfaces/post-query';
import { ModerationHistoryResponse } from '@/app/api/schemas/moderation-history-response';
import { PostVersionDiffResponse } from '@/app/api/schemas/post-version-diff-response';
import {
  PaginatedPostVersionResponse,
  PaginatedPostVersionResponseSchema,
  PostVersionResponse,
} from '@/app/api/schemas/post-version-response';
import { PaginatedPostResponse, PaginatedPostResponseSchema, PostResponse } from '@/app/api/schemas/posts-response';
import { NewPost } from '@/app/interfaces/post-form';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';
import { buildHttpParams } from '@/app/utils/http-params';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly message = inject(MessageService);

  public createPost(post: NewPost): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, post).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_POST_SUCCESS);
      }),
    );
  }

  public deletePost(postId: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_POST_SUCCESS);
      }),
    );
  }

  public deletePostVersion(postId: number, version: number): Observable<PostVersionResponse> {
    return this.http
      .delete<PostVersionResponse>(
        `${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}/${ENDPOINTS.VERSIONS}/${version.toString()}`,
      )
      .pipe(
        tap(() => {
          this.message.success(MESSAGE.DELETE_POST_VERSION_SUCCESS);
        }),
      );
  }

  public getAllPosts(query?: PostQuery): Observable<null | PaginatedPostResponse> {
    return this.http
      .get<PaginatedPostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, {
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
    return this.http.get<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/id/${postId.toString()}`);
  }

  public getPostBySlug(slug: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${slug}`);
  }

  public getPostModerationHistory(postId: number): Observable<ModerationHistoryResponse[]> {
    return this.http.get<ModerationHistoryResponse[]>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}/${ENDPOINTS.AUDIT}/${ENDPOINTS.FULL_HISTORY}`,
    );
  }

  public getPostsByAuthor(username: string, query?: PostQuery): Observable<null | PaginatedPostResponse> {
    const params = query ? buildHttpParams(query, POST_QUERY_KEYS) : new HttpParams();
    return this.http
      .get<PaginatedPostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${username}/${ENDPOINTS.POSTS}`, {
        params,
      })
      .pipe(
        map((response: PaginatedPostResponse) => {
          const { data, success } = PaginatedPostResponseSchema.safeParse(response);
          return success ? data : null;
        }),
      );
  }

  public getPostVersionDiff(
    postId: number,
    fromVersion: number,
    toVersion: number,
  ): Observable<PostVersionDiffResponse> {
    const params = new HttpParams().set('from', fromVersion.toString()).set('to', toVersion.toString());
    return this.http.get<PostVersionDiffResponse>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}/${ENDPOINTS.VERSIONS}/${ENDPOINTS.VERSION_DIFF}/`,
      { params },
    );
  }

  public getVersionsByPost(postId: number, query?: PostQuery): Observable<null | PaginatedPostVersionResponse> {
    return this.http
      .get<PaginatedPostVersionResponse>(
        `${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}/${ENDPOINTS.VERSIONS}`,
        { params: { ...query } },
      )
      .pipe(
        map((response: PaginatedPostVersionResponse) => {
          const { data, success } = PaginatedPostVersionResponseSchema.safeParse(response);
          return success ? data : null;
        }),
      );
  }

  public performPostAuthorAction(postId: number, action: string): Observable<PostResponse> {
    return this.http
      .patch<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}/${ENDPOINTS.MODERATION}`, {
        action,
      })
      .pipe(
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
    return this.http
      .patch<PostResponse>(
        `${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}/${ENDPOINTS.MODERATION}/${ENDPOINTS.MODERATOR}`,
        { action, comment, reasons },
      )
      .pipe(
        tap(() => {
          this.message.info(MESSAGE.APPROVE_POST_SUCCESS);
        }),
      );
  }

  public revertToVersion(postId: number, version: number): Observable<PostResponse> {
    return this.http
      .post<PostResponse>(
        `${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}/${ENDPOINTS.VERSIONS}/${version.toString()}/${ENDPOINTS.REVERT}`,
        {},
      )
      .pipe(
        tap(() => {
          this.message.info(MESSAGE.REVERT_POST_SUCCESS);
        }),
      );
  }

  public updatePost(postId: number, post: NewPost): Observable<PostResponse> {
    return this.http.patch<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`, post).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_POST_SUCCESS);
      }),
    );
  }
}
