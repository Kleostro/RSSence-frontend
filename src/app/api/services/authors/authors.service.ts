import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { POST_QUERY_KEYS, PostQuery } from '@/app/api/interfaces/post-query';
import { PostStatuses } from '@/app/api/interfaces/post/post-statuses';
import {
  AuthorResponse,
  PaginatedAuthorResponse,
  PaginatedAuthorResponseSchema,
} from '@/app/api/schemas/authors-response';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';
import { buildHttpParams } from '@/app/utils/http-params';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private readonly http = inject(HttpClient);
  private readonly message = inject(MessageService);

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${ENDPOINTS.USERNAME_CHECK}`, {
      username,
    });
  }

  public createAuthor(author: FormData): Observable<AuthorResponse> {
    return this.http.post<AuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`, author).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_AUTHOR_SUCCESS);
      }),
    );
  }

  public deleteAuthor(username: string): Observable<AuthorResponse> {
    return this.http.delete<AuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}`).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_AUTHOR_SUCCESS);
      }),
    );
  }

  public getAuthorByUsername(username: string): Observable<AuthorResponse | null> {
    return this.http.get<AuthorResponse | null>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}`);
  }

  public getAuthorContributionStats(
    username: string,
    query?: PostQuery,
  ): Observable<{ count: number; label: string; value: boolean | undefined }[]> {
    const params = query ? buildHttpParams(query, POST_QUERY_KEYS) : new HttpParams();
    return this.http.get<{ count: number; label: string; value: boolean | undefined }[]>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}/${ENDPOINTS.CONTRIBUTION_STATS}`,
      {
        params,
      },
    );
  }

  public getAuthorPostStatuses(username: string, query?: PostQuery): Observable<PostStatuses[]> {
    const params = query ? buildHttpParams(query, POST_QUERY_KEYS) : new HttpParams();
    return this.http.get<PostStatuses[]>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}/${ENDPOINTS.POSTS.slice(0, -1)}-statuses`,
      {
        params,
      },
    );
  }

  public getAuthors(query?: PaginationQueryDto): Observable<null | PaginatedAuthorResponse> {
    return this.http
      .get<PaginatedAuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`, {
        params: { ...query },
      })
      .pipe(
        map((response: PaginatedAuthorResponse) => {
          const { data, success } = PaginatedAuthorResponseSchema.safeParse(response);
          return success ? data : null;
        }),
      );
  }

  public updateAuthor(author: FormData): Observable<AuthorResponse> {
    return this.http.patch<AuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`, author).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_AUTHOR_SUCCESS);
      }),
    );
  }
}
