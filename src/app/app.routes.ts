import { Routes } from '@angular/router';

import { APP_PATH } from '@/app/core/services/navigation/routes';

export const routes: Routes = [
  {
    path: APP_PATH.DEFAULT,
    loadComponent: () => import('./home/pages/home/home.component').then((c) => c.HomeComponent),
    title: 'RSS | Home',
  },
  {
    path: APP_PATH.LOGIN.toLowerCase(),
    loadComponent: () => import('./auth/pages/login/login.component').then((c) => c.LoginComponent),
    title: `RSS | ${APP_PATH.LOGIN}`,
  },
  {
    path: APP_PATH.SIGN_UP.toLowerCase(),
    loadComponent: () =>
      import('./auth/pages/registration/registration.component').then((c) => c.RegistrationComponent),
    title: `RSS | ${APP_PATH.SIGN_UP}`,
  },
  {
    path: APP_PATH.PROFILE.toLowerCase(),
    loadComponent: () => import('./profile/pages/profile/profile.component').then((c) => c.ProfileComponent),
    title: `RSS | ${APP_PATH.PROFILE}`,
  },
  {
    path: APP_PATH.NOT_FOUND,
    loadComponent: () => import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    title: `RSS | ${APP_PATH.NOT_FOUND}`,
  },
  {
    path: APP_PATH.NO_MATCH,
    redirectTo: APP_PATH.NOT_FOUND,
  },
];

export default routes;
