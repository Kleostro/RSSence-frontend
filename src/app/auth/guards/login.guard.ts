import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { catchError, map, of } from 'rxjs';

import { UserService } from '@/app/auth/services/user/user.service';
import { STORE_KEYS } from '@/app/constants/store-keys';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';

export const authGuard: CanActivateFn = () => {
  const ls = inject(WA_LOCAL_STORAGE);
  const isUserLoggedIn = ls.getItem(STORE_KEYS.ACCESS_TOKEN);
  return !!isUserLoggedIn || inject(Router).navigate([APP_ROUTE.LOGIN]);
};

export const loginGuard: CanActivateFn = () => {
  const ls = inject(WA_LOCAL_STORAGE);
  const isUserLoggedIn = ls.getItem(STORE_KEYS.ACCESS_TOKEN);
  return !isUserLoggedIn || inject(Router).navigate([APP_ROUTE.HOME]);
};

export const meGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.getMe().pipe(
    map((me) => {
      if (me) {
        return true;
      } else {
        router.navigate([APP_ROUTE.LOGIN]);
        return false;
      }
    }),
    catchError(() => {
      router.navigate([APP_ROUTE.LOGIN]);
      return of(false);
    }),
  );
};
