import { Routes } from '@angular/router';

import { adminGuard, authGuard, loginGuard, userGuard } from '@/app/auth/guards/login.guard';
import { authorResolver, meAuthorResolver } from '@/app/author/resolvers/author.resolver';
import { ADMIN_PATH, APP_PATH } from '@/app/core/services/navigation/routes';
import { meProfileResolver, profileResolver } from '@/app/profile/resolvers/profile.resolver';

export const routes: Routes = [
  {
    canActivate: [userGuard],
    loadComponent: () => import('./home/pages/home/home.component').then((c) => c.HomeComponent),
    path: APP_PATH.DEFAULT,
    title: 'RSS | Home',
  },
  {
    canActivate: [loginGuard],
    loadComponent: () => import('./auth/pages/login/login.component').then((c) => c.LoginComponent),
    path: APP_PATH.LOGIN.toLowerCase(),
    title: `RSS | ${APP_PATH.LOGIN}`,
  },
  {
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./auth/pages/registration/registration.component').then((c) => c.RegistrationComponent),
    path: APP_PATH.SIGN_UP.toLowerCase(),
    title: `RSS | ${APP_PATH.SIGN_UP}`,
  },
  {
    canActivate: [authGuard],
    loadComponent: () => import('./profile/pages/me-profile/me-profile.component').then((c) => c.MeProfileComponent),
    path: APP_PATH.PROFILE.toLowerCase(),
    resolve: { profile: meProfileResolver },
  },
  {
    canActivate: [authGuard],
    loadComponent: () => import('./profile/pages/profile/profile.component').then((c) => c.ProfileComponent),
    path: `${APP_PATH.PROFILE.toLowerCase()}/:id`,
    resolve: { profile: profileResolver },
  },
  {
    canActivate: [authGuard],
    loadComponent: () => import('./author/pages/me-author/me-author.component').then((c) => c.MeAuthorComponent),
    path: APP_PATH.AUTHOR.toLowerCase(),
    resolve: { author: meAuthorResolver },
  },
  {
    canActivate: [authGuard],
    loadComponent: () => import('./author/pages/author/author.component').then((c) => c.AuthorComponent),
    path: `${APP_PATH.AUTHOR.toLowerCase()}/:id`,
    resolve: { author: authorResolver },
  },
  {
    canActivate: [userGuard],
    loadComponent: () => import('./post/pages/posts/posts.component').then((c) => c.PostsComponent),
    path: APP_PATH.POSTS.toLowerCase(),
    title: `RSS | ${APP_PATH.POSTS}`,
  },
  {
    canActivate: [userGuard],
    loadComponent: () =>
      import('./post/pages/post-detailed/post-detailed.component').then((c) => c.PostDetailedComponent),
    path: `${APP_PATH.POSTS.toLowerCase()}/:id`,
    title: `RSSence | ${APP_PATH.POSTS.slice(0, -1)}`,
  },
  {
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ADMIN_PATH.USERS.toLowerCase(),
      },
      {
        loadComponent: () => import('./admin/pages/users/users.component').then((c) => c.UsersComponent),
        path: ADMIN_PATH.USERS.toLowerCase(),
        title: `Admin | ${ADMIN_PATH.USERS}`,
      },
    ],
    loadComponent: () =>
      import('./admin/layout/admin-layout/admin-layout.component').then((c) => c.AdminLayoutComponent),
    path: APP_PATH.ADMIN.toLowerCase(),
    title: `Tu-Tu | ${APP_PATH.ADMIN}`,
  },
  {
    loadComponent: () => import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    path: APP_PATH.NOT_FOUND,
    title: `RSS | ${APP_PATH.NOT_FOUND}`,
  },
  {
    path: APP_PATH.NO_MATCH,
    redirectTo: APP_PATH.NOT_FOUND,
  },
];

export default routes;
