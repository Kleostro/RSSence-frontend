import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, Observable, take, tap } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private readonly authorsService = inject(AuthorsService);
  private readonly message = inject(MessageService);

  public readonly currentAuthor = signal<AuthorsResponse | null>(null);

  public createAuthorMe(dto: FormData): Observable<AuthorsResponse> {
    return this.authorsService.createAuthorMe(dto).pipe(
      take(1),
      tap((author: AuthorsResponse) => {
        this.currentAuthor.set(author);
        this.message.success(MESSAGE.CREATE_AUTHOR_SUCCESS);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getAuthorMe(): Observable<AuthorsResponse | null> {
    return this.authorsService.getAuthorMe().pipe(
      take(1),
      tap((author: AuthorsResponse | null) => {
        this.currentAuthor.set(author);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public updateAuthorMe(dto: FormData): Observable<AuthorsResponse> {
    return this.authorsService.updateAuthorMe(dto).pipe(
      take(1),
      tap((author: AuthorsResponse) => {
        this.currentAuthor.set(author);
        this.message.success(MESSAGE.UPDATE_AUTHOR_SUCCESS);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public deleteAuthorMe(): Observable<AuthorsResponse> {
    return this.authorsService.deleteAuthorMe().pipe(
      take(1),
      tap(() => {
        this.currentAuthor.set(null);
        this.message.success(MESSAGE.DELETE_AUTHOR_SUCCESS);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.authorsService.checkUsernameAvailability(username).pipe(
      take(1),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  private handleError(error: OverriddenHttpErrorResponse): Observable<never> {
    this.message.error(error.error.message);
    return EMPTY;
  }
}
