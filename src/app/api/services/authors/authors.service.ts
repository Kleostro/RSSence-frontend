/* eslint-disable @typescript-eslint/no-misused-spread */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, PaginatedAuthorResponse } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private readonly http = inject(HttpClient);

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${ENDPOINTS.USERNAME_CHECK}`, {
      username,
    });
  }

  public createAuthor(author: FormData): Observable<AuthorResponse> {
    return this.http.post<AuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`, author);
  }

  public deleteAuthor(username: string): Observable<AuthorResponse> {
    return this.http.delete<AuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}`);
  }

  public getAuthorByUsername(username: string): Observable<AuthorResponse | null> {
    return this.http.get<AuthorResponse | null>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}`);
  }

  public getAuthorPosts(username: string, query?: PaginationQueryDto): Observable<PaginatedPostResponse> {
    return this.http.get<PaginatedPostResponse>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}/${ENDPOINTS.POSTS}`,
      {
        params: { ...query },
      },
    );
  }

  public getAuthors(query?: PaginationQueryDto): Observable<PaginatedAuthorResponse> {
    return this.http.get<PaginatedAuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`, {
      params: { ...query },
    });
  }

  public updateAuthor(username: string, author: FormData): Observable<AuthorResponse> {
    return this.http.patch<AuthorResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${username}`, author);
  }
}
