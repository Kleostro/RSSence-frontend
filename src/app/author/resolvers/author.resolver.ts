import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';

import { catchError, EMPTY, of, switchMap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { UserResponse } from '@/app/api/schemas/users-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

export const meAuthorResolver: ResolveFn<AuthorResponse | null> = () => {
  const usersService = inject(UsersService);
  const title = inject(Title);

  const meAuthor = usersService.me()?.author ?? null;
  title.setTitle('Author | ' + (meAuthor?.username ?? ''));
  return meAuthor ?? null;
};

export const authorResolver: ResolveFn<null | UserResponse> = (route) => {
  const usersService = inject(UsersService);
  const authorsService = inject(AuthorsService);
  const navigationService = inject(NavigationService);
  const title = inject(Title);

  const username = String(route.params['id']);

  if (typeof username === 'string') {
    return authorsService.getAuthorByUsername(username).pipe(
      switchMap((author) =>
        usersService.getUserById(author?.userId ?? 0).pipe(
          switchMap((user) => {
            if (user?.author?.id === usersService.me()?.author?.id) {
              navigationService.navigateToAuthor();
              return of(usersService.me());
            } else {
              title.setTitle('Author | ' + (author?.username ?? ''));
              return of(user);
            }
          }),
        ),
      ),
      catchError(() => {
        navigationService.navigateToNotFound();
        return EMPTY;
      }),
    );
  }
  return of(null);
};
