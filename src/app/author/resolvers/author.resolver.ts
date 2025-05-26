import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';

import { map, of, switchMap, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

export const meAuthorResolver: ResolveFn<AuthorResponse | null> = () => {
  const usersService = inject(UsersService);
  const title = inject(Title);
  return usersService.getMe().pipe(
    map((me) => me?.author ?? null),
    tap((author) => {
      title.setTitle('RSS | ' + (author?.username ?? 'Author'));
    }),
  );
};

export const authorResolver: ResolveFn<AuthorResponse | null> = (route) => {
  const usersService = inject(UsersService);
  const authorsService = inject(AuthorsService);
  const navigationService = inject(NavigationService);
  const title = inject(Title);

  const { id } = route.params;
  if (typeof id === 'string') {
    return usersService.getMe().pipe(
      map((me) => me?.author ?? null),
      switchMap((meAuthor) =>
        authorsService.getAuthorByUsername(id).pipe(
          tap((author) => {
            if (meAuthor?.username === author?.username) {
              navigationService.navigateToAuthor();
            }
            if (!author) {
              navigationService.navigateToNotFound();
            }
            title.setTitle('RSS | ' + (author?.username ?? ''));
          }),
        ),
      ),
    );
  }
  return of(null);
};
