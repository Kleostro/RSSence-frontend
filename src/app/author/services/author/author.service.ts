import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, PaginatedAuthorResponse } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse, PaginatedPostResponseSchema } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private readonly authorsService = inject(AuthorsService);
  private readonly message = inject(MessageService);

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.authorsService.checkUsernameAvailability(username);
  }

  public createAuthor(dto: FormData): Observable<AuthorResponse> {
    return this.authorsService.createAuthor(dto).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_AUTHOR_SUCCESS);
      }),
    );
  }

  public deleteAuthor(username: string): Observable<AuthorResponse> {
    return this.authorsService.deleteAuthor(username).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_AUTHOR_SUCCESS);
      }),
    );
  }

  public getAuthorByUsername(username: string): Observable<AuthorResponse | null> {
    return this.authorsService.getAuthorByUsername(username);
  }

  public getAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorsService.getAuthorPosts(username, query).pipe(
      map((response: PaginatedPostResponse) => {
        const result = PaginatedPostResponseSchema.safeParse(response);
        return result.success ? result.data : null;
      }),
    );
  }

  public getAuthors(query?: PaginationQueryDto): Observable<PaginatedAuthorResponse> {
    return this.authorsService.getAuthors(query);
  }

  public updateAuthor(username: string, dto: FormData): Observable<AuthorResponse> {
    return this.authorsService.updateAuthor(username, dto).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_AUTHOR_SUCCESS);
      }),
    );
  }
}
