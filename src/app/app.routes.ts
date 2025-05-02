import { Routes } from '@angular/router';

import { authGuard, loginGuard } from '@/app/auth/guards/login.guard';
import { APP_PATH } from '@/app/core/services/navigation/routes';

export const routes: Routes = [
  {
    path: APP_PATH.DEFAULT,
    loadComponent: () => import('./home/pages/home/home.component').then((c) => c.HomeComponent),
    title: 'RSS | Home',
    canActivate: [authGuard],
  },
  {
    path: APP_PATH.LOGIN.toLowerCase(),
    loadComponent: () => import('./auth/pages/login/login.component').then((c) => c.LoginComponent),
    title: `RSS | ${APP_PATH.LOGIN}`,
    canActivate: [loginGuard],
  },
  {
    path: APP_PATH.SIGN_UP.toLowerCase(),
    loadComponent: () =>
      import('./auth/pages/registration/registration.component').then((c) => c.RegistrationComponent),
    title: `RSS | ${APP_PATH.SIGN_UP}`,
    canActivate: [loginGuard],
  },
  {
    path: APP_PATH.PROFILE.toLowerCase(),
    pathMatch: 'full',
    loadComponent: () => import('./profile/pages/profile/profile.component').then((c) => c.ProfileComponent),
    title: `RSS | ${APP_PATH.PROFILE}`,
    canActivate: [authGuard],
  },
  {
    path: `${APP_PATH.PROFILE.toLowerCase()}/:id`,
    pathMatch: 'full',
    loadComponent: () => import('./profile/pages/profile/profile.component').then((c) => c.ProfileComponent),
    title: `RSS | ${APP_PATH.PROFILE}`,
    canActivate: [authGuard],
  },
  {
    path: APP_PATH.AUTHOR.toLowerCase(),
    pathMatch: 'full',
    loadComponent: () => import('./author/pages/author/author.component').then((c) => c.AuthorComponent),
    title: `RSS | ${APP_PATH.AUTHOR}`,
    canActivate: [authGuard],
  },
  {
    path: `${APP_PATH.AUTHOR.toLowerCase()}/:id`,
    pathMatch: 'full',
    loadComponent: () => import('./author/pages/author/author.component').then((c) => c.AuthorComponent),
    title: `RSSence | ${APP_PATH.AUTHOR}`,
    canActivate: [authGuard],
  },
  {
    path: `${APP_PATH.AUTHOR.toLowerCase()}/:id/${APP_PATH.POSTS.toLowerCase()}`,
    pathMatch: 'full',
    loadComponent: () => import('./post/pages/posts/posts.component').then((c) => c.PostsComponent),
    title: `RSSence | ${APP_PATH.AUTHOR} | ${APP_PATH.POSTS}`,
    canActivate: [authGuard],
  },
  {
    path: APP_PATH.POSTS.toLowerCase(),
    canActivate: [authGuard],
    pathMatch: 'full',
    loadComponent: () => import('./post/pages/posts/posts.component').then((c) => c.PostsComponent),
    title: `RSS | ${APP_PATH.POSTS}`,
  },
  {
    path: `${APP_PATH.POSTS.toLowerCase()}/:id`,
    loadComponent: () =>
      import('./post/pages/post-detailed/post-detailed.component').then((c) => c.PostDetailedComponent),
    title: `RSSence | ${APP_PATH.POSTS.slice(0, -1)}`,
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
