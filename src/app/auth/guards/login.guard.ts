import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { of } from 'rxjs';

import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { STORE_KEYS } from '@/app/constants/store-keys';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';

export const loginGuard: CanActivateFn = () => {
  const ls = inject(WA_LOCAL_STORAGE);
  const isUserLoggedIn = ls.getItem(STORE_KEYS.ACCESS_TOKEN);
  return !isUserLoggedIn || inject(Router).navigate([APP_ROUTE.HOME]);
};

export const authGuard: CanActivateFn = () => {
  const ls = inject(WA_LOCAL_STORAGE);
  const isUserLoggedIn = ls.getItem(STORE_KEYS.ACCESS_TOKEN);
  return Boolean(isUserLoggedIn) || inject(Router).navigate([APP_ROUTE.LOGIN]);
};

export const createRoleGuard = (minRequiredRole?: string): CanActivateFn => {
  return () => {
    const navigationService = inject(NavigationService);
    const usersService = inject(UsersService);
    const rolesService = inject(RolesService);

    if (rolesService.hasAccess(usersService.me()?.roles ?? [], minRequiredRole)) {
      return of(true);
    } else {
      navigationService.navigateToForbidden();
      return of(false);
    }
  };
};

export const guestGuard = createRoleGuard();
export const userGuard = createRoleGuard('USER');
export const moderatorGuard = createRoleGuard('MODERATOR');
export const adminGuard = createRoleGuard('ADMIN');
export const superAdminGuard = createRoleGuard('SUPER_ADMIN');
