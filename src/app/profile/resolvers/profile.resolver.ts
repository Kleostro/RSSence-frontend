import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';

import { map, of, switchMap, tap } from 'rxjs';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';
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

export const profileResolver: ResolveFn<null | ProfileResponse> = (route) => {
  const usersService = inject(UsersService);
  const profilesService = inject(ProfilesService);
  const navigationService = inject(NavigationService);
  const title = inject(Title);

  const { id } = route.params;
  if (typeof id === 'string') {
    return usersService.getMe().pipe(
      map((me) => me?.profile ?? null),
      switchMap((meProfile) =>
        profilesService.getProfileByUsername(id).pipe(
          tap((profile) => {
            if (!profile) {
              navigationService.navigateToNotFound();
            }
            if (meProfile?.username === profile?.username) {
              navigationService.navigateToProfile();
            }
            title.setTitle('RSS | ' + (profile?.username ?? ''));
          }),
        ),
      ),
    );
  }
  return of(null);
};
