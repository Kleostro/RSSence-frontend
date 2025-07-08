import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { catchError, of, switchMap } from 'rxjs';

import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
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

export const createRoleGuard = (minRequiredRole?: string): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const usersService = inject(UsersService);
    const rolesService = inject(RolesService);

    return rolesService.getRoleHierarchy().pipe(
      switchMap(() =>
        usersService.getMe().pipe(
          switchMap((me) => {
            if (!me) {
              return of(router.createUrlTree([APP_ROUTE.LOGIN]));
            }

            if (rolesService.hasAccess(me.roles, minRequiredRole)) {
              return of(true);
            } else {
              // TBD: redirect to 403
              return of(router.createUrlTree([APP_ROUTE.NOT_FOUND]));
            }
          }),
          catchError(() => of(router.createUrlTree([APP_ROUTE.LOGIN]))),
        ),
      ),
    );
  };
};

export const guestGuard = createRoleGuard();
export const userGuard = createRoleGuard('USER');
export const moderatorGuard = createRoleGuard('MODERATOR');
export const adminGuard = createRoleGuard('ADMIN');
export const superAdminGuard = createRoleGuard('SUPER_ADMIN');
