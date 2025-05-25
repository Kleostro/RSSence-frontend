import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';

import { map, of, switchMap, tap } from 'rxjs';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ProfileService } from '@/app/profile/services/profile/profile.service';

export const meProfileResolver: ResolveFn<null | ProfileResponse> = () => {
  const userService = inject(UserService);
  const title = inject(Title);
  return userService.getMe().pipe(
    map((me) => me?.profile ?? null),
    tap((profile) => {
      title.setTitle('RSS | ' + (profile?.username ?? 'Profile'));
    }),
  );
};

export const profileResolver: ResolveFn<null | ProfileResponse> = (route) => {
  const userService = inject(UserService);
  const profileService = inject(ProfileService);
  const navigationService = inject(NavigationService);
  const title = inject(Title);

  const { id } = route.params;
  if (typeof id === 'string') {
    return userService.getMe().pipe(
      map((me) => me?.profile ?? null),
      switchMap((meProfile) =>
        profileService.getProfileByUsername(id).pipe(
          tap((profile) => {
            if (meProfile?.username === profile?.username) {
              navigationService.navigateToProfile();
            }
            if (!profile) {
              navigationService.navigateToNotFound();
            }
            title.setTitle('RSS | ' + (profile?.username ?? ''));
          }),
        ),
      ),
    );
  }
  return of(null);
};
