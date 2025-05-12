import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, finalize, map, Observable, take, tap, throwError } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, PaginatedAuthorResponse } from '@/app/api/schemas/authors-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PaginatedPostResponse, PaginatedPostResponseSchema } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private readonly authorsService = inject(AuthorsService);
  private readonly loaderService = inject(LoaderService);
  private readonly message = inject(MessageService);
  private readonly userService = inject(UsersService);

  private handleError(error: OverriddenHttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.authorsService.checkUsernameAvailability(username).pipe(
      take(1),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public createAuthor(dto: FormData): Observable<AuthorResponse> {
    this.loaderService.turnOn();
    return this.authorsService.createAuthor(dto).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.CREATE_AUTHOR_SUCCESS);
        this.userService.getMe().subscribe();
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public deleteAuthor(): Observable<AuthorResponse> {
    this.loaderService.turnOn();
    return this.authorsService.deleteAuthor().pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.DELETE_AUTHOR_SUCCESS);
        this.userService.getMe().subscribe();
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getAuthorById(authorId: number): Observable<AuthorResponse | null> {
    this.loaderService.turnOn();
    return this.authorsService.getAuthorById(authorId).pipe(
      take(1),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getAuthorPosts(authorId: number, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    this.loaderService.turnOn();
    return this.authorsService.getAuthorPosts(authorId, query).pipe(
      take(1),
      map((response: PaginatedPostResponse) => {
        const result = PaginatedPostResponseSchema.safeParse(response);
        return result.success ? result.data : null;
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getAuthors(query?: PaginationQueryDto): Observable<PaginatedAuthorResponse> {
    this.loaderService.turnOn();
    return this.authorsService.getAuthors(query).pipe(
      take(1),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public updateAuthor(dto: FormData): Observable<AuthorResponse> {
    this.loaderService.turnOn();
    return this.authorsService.updateAuthor(dto).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.UPDATE_AUTHOR_SUCCESS);
        this.userService.getMe().subscribe();
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }
}
