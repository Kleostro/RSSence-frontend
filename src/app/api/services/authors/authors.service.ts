import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import {
  AuthorResponse,
  PaginatedAuthorResponse,
  PaginatedAuthorResponseSchema,
} from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse, PaginatedPostResponseSchema } from '@/app/api/schemas/posts-response';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';
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

  public getAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.http
      .get<PaginatedPostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}/${ENDPOINTS.POSTS}`, {
        params: { ...query },
      })
      .pipe(
        map((response: PaginatedPostResponse) => {
          const { data, success } = PaginatedPostResponseSchema.safeParse(response);
          return success ? data : null;
        }),
      );
  }

  public getAuthorPostStatuses(username: string): Observable<{ count: number; name: string }[]> {
    return this.http.get<{ count: number; name: string }[]>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}/${ENDPOINTS.POSTS.slice(0, -1)}-statuses`,
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

  public updateAuthor(username: string, author: FormData): Observable<AuthorResponse> {
    return this.http.patch<AuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}`, author).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_AUTHOR_SUCCESS);
      }),
    );
  }
}
