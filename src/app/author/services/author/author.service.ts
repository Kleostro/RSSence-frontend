import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, finalize, Observable, take, tap, throwError } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
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

  public readonly authorMe = signal<AuthorsResponse | null>(null);
  public readonly authors = signal<AuthorsResponse[]>([]);

  private handleError(error: OverriddenHttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.authorsService.checkUsernameAvailability(username).pipe(
      take(1),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public createAuthor(dto: FormData): Observable<AuthorsResponse> {
    this.loaderService.turnOn();
    return this.authorsService.createAuthor(dto).pipe(
      take(1),
      tap((newAuthor: AuthorsResponse) => {
        this.authors.update((authors) => [newAuthor, ...authors]);
        this.message.success(MESSAGE.CREATE_AUTHOR_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public deleteAuthor(): Observable<AuthorsResponse> {
    this.loaderService.turnOn();
    return this.authorsService.deleteAuthor().pipe(
      take(1),
      tap((deletedAuthor: AuthorsResponse) => {
        this.authors.update((authors) => authors.filter((author) => author.userId !== deletedAuthor.userId));
        this.authorMe.set(null);
        this.message.success(MESSAGE.DELETE_AUTHOR_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public findAuthorById(authorId: null | number): AuthorsResponse | null {
    return this.authors().find((author) => author.id === authorId) ?? null;
  }

  public getAuthors(): Observable<AuthorsResponse[]> {
    this.loaderService.turnOn();
    return this.authorsService.getAuthors().pipe(
      take(1),
      tap((authors: AuthorsResponse[]) => {
        this.authors.set(authors);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public updateAuthor(dto: FormData): Observable<AuthorsResponse> {
    this.loaderService.turnOn();
    return this.authorsService.updateAuthor(dto).pipe(
      take(1),
      tap((updatedAuthor: AuthorsResponse) => {
        this.authors.update((authors) =>
          authors.map((author) => (author.userId === updatedAuthor.userId ? updatedAuthor : author)),
        );
        this.message.success(MESSAGE.UPDATE_AUTHOR_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }
}
