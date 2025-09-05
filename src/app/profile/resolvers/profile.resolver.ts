import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';

import { map, of, switchMap, tap } from 'rxjs';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';
import { UserResponse } from '@/app/api/schemas/users-response';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

export const meProfileResolver: ResolveFn<null | ProfileResponse> = () => {
  const usersService = inject(UsersService);
  const title = inject(Title);
  return usersService.getMe().pipe(
    map((me) => me?.profile ?? null),
    tap((profile) => {
      title.setTitle('RSS | ' + (profile?.username ?? 'Profile'));
    }),
  );
};

export const profileResolver: ResolveFn<null | UserResponse> = (route) => {
  const usersService = inject(UsersService);
  const profilesService = inject(ProfilesService);
  const navigationService = inject(NavigationService);
  const title = inject(Title);

  const username = String(route.params['id']);

  if (typeof username === 'string') {
    return profilesService.getProfileByUsername(username).pipe(
      tap((profile) => {
        if (!profile) {
          navigationService.navigateToNotFound();
        }
      }),
      switchMap((profile) =>
        usersService.getUserById(profile?.userId ?? 0).pipe(
          switchMap((user) => {
            if (user?.profile?.id === usersService.me()?.profile?.id) {
              navigationService.navigateToAuthor();
              return of(usersService.me());
            } else {
              title.setTitle('RSS | ' + (profile?.username ?? ''));
              return of(user);
            }
          }),
        ),
      ),
    );
  }
  return of(null);
};
