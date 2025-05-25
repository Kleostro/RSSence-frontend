import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';

import { map, of, switchMap, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

export const meAuthorResolver: ResolveFn<AuthorResponse | null> = () => {
  const userService = inject(UserService);
  const title = inject(Title);
  return userService.getMe().pipe(
    map((me) => me?.author ?? null),
    tap((author) => {
      title.setTitle('RSS | ' + (author?.username ?? 'Author'));
    }),
  );
};

export const authorResolver: ResolveFn<AuthorResponse | null> = (route) => {
  const userService = inject(UserService);
  const authorService = inject(AuthorService);
  const navigationService = inject(NavigationService);
  const title = inject(Title);

  const { id } = route.params;
  if (typeof id === 'string') {
    return userService.getMe().pipe(
      map((me) => me?.author ?? null),
      switchMap((meAuthor) =>
        authorService.getAuthorByUsername(id).pipe(
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
