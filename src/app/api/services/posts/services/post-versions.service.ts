import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PART } from '@/app/api/constants/parts';
import { PostQuery } from '@/app/api/interfaces/post-query';
import { PostVersionDiffResponse } from '@/app/api/schemas/post/post-version-diff-response';
import {
  PaginatedPostVersionResponse,
  PaginatedPostVersionResponseSchema,
  PostVersionResponse,
} from '@/app/api/schemas/post/post-version-response';
import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { buildApiUrl } from '@/app/api/utils/build-api-url';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class PostVersionsService {
  private readonly http = inject(HttpClient);
  private readonly message = inject(MessageService);

  public deletePostVersion(postId: number, version: number): Observable<PostVersionResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.VERSIONS, version.toString());
    return this.http.delete<PostVersionResponse>(url).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_POST_VERSION_SUCCESS);
      }),
    );
  }

  public getPostVersionDiff(
    postId: number,
    fromVersion: number,
    toVersion: number,
  ): Observable<PostVersionDiffResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.VERSIONS, PART.VERSION_DIFF);
    const params = new HttpParams().set('from', fromVersion.toString()).set('to', toVersion.toString());
    return this.http.get<PostVersionDiffResponse>(url, { params });
  }

  public getVersionDiffForPostReview(postId: number): Observable<PostVersionDiffResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.VERSIONS, PART.REVIEW);
    return this.http.get<PostVersionDiffResponse>(url);
  }

  public getVersionsByPost(postId: number, query?: PostQuery): Observable<null | PaginatedPostVersionResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.VERSIONS);
    return this.http.get<PaginatedPostVersionResponse>(url, { params: { ...query } }).pipe(
      map((response: PaginatedPostVersionResponse) => {
        const { data, success } = PaginatedPostVersionResponseSchema.safeParse(response);
        return success ? data : null;
      }),
    );
  }

  public revertToVersion(postId: number, version: number): Observable<PostResponse> {
    const url = buildApiUrl(ENDPOINTS.POSTS, postId.toString(), PART.VERSIONS, version.toString(), PART.REVERT);
    return this.http.post<PostResponse>(url, null).pipe(
      tap(() => {
        this.message.info(MESSAGE.REVERT_POST_SUCCESS);
      }),
    );
  }
}
