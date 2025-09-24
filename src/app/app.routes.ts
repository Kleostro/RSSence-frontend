import { Routes } from '@angular/router';

import { adminGuard, loginGuard, moderatorGuard, userGuard } from '@/app/auth/guards/login.guard';
import { authorResolver, meAuthorResolver } from '@/app/author/resolvers/author.resolver';
import { ADMIN_PATH, APP_PATH, MODERATOR_PATH } from '@/app/core/services/navigation/routes';
import { postAuthorGuard } from '@/app/post/guards/post-author.guard';
import { postMainAuthorGuard } from '@/app/post/guards/post-main-author.guard';
import { meProfileResolver, profileResolver } from '@/app/profile/resolvers/profile.resolver';

export const routes: Routes = [
  {
    canActivate: [userGuard],
    loadComponent: () => import('./home/pages/home/home.component').then((c) => c.HomeComponent),
    path: APP_PATH.DEFAULT,
    title: 'Home',
  },
  {
    canActivate: [loginGuard],
    loadComponent: () => import('./auth/pages/login/login.component').then((c) => c.LoginComponent),
    path: APP_PATH.LOGIN.toLowerCase(),
    title: APP_PATH.LOGIN,
  },
  {
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./auth/pages/registration/registration.component').then((c) => c.RegistrationComponent),
    path: APP_PATH.SIGN_UP.toLowerCase(),
    title: APP_PATH.SIGN_UP,
  },
  {
    canActivate: [userGuard],
    loadComponent: () => import('./profile/pages/me-profile/me-profile.component').then((c) => c.MeProfileComponent),
    path: APP_PATH.PROFILE.toLowerCase(),
    resolve: { profile: meProfileResolver },
  },
  {
    canActivate: [userGuard],
    loadComponent: () => import('./profile/pages/profile/profile.component').then((c) => c.ProfileComponent),
    path: `${APP_PATH.PROFILE.toLowerCase()}/:id`,
    resolve: { user: profileResolver },
  },
  {
    canActivate: [userGuard],
    loadComponent: () => import('./author/pages/me-author/me-author.component').then((c) => c.MeAuthorComponent),
    path: APP_PATH.AUTHOR.toLowerCase(),
    resolve: { author: meAuthorResolver },
  },
  {
    canActivate: [userGuard],
    loadComponent: () => import('./author/pages/author/author.component').then((c) => c.AuthorComponent),
    path: `${APP_PATH.AUTHOR.toLowerCase()}/:id`,
    resolve: { user: authorResolver },
  },
  {
    canActivate: [userGuard],
    loadComponent: () => import('./post/pages/posts/posts.component').then((c) => c.PostsComponent),
    path: APP_PATH.POSTS.toLowerCase(),
    title: APP_PATH.POSTS,
  },
  {
    canActivate: [userGuard],
    loadComponent: () =>
      import('./post/pages/post-detailed/post-detailed.component').then((c) => c.PostDetailedComponent),
    path: `${APP_PATH.POSTS.toLowerCase()}/:id`,
    title: `RSSence | ${APP_PATH.POSTS.slice(0, -1)}`,
  },
  {
    canActivate: [postAuthorGuard],
    loadComponent: () => import('./post/pages/post-history/post-history.component').then((c) => c.PostHistoryComponent),
    path: `${APP_PATH.POSTS.toLowerCase()}/:id/${APP_PATH.HISTORY.toLowerCase()}`,
    title: `Post | ${APP_PATH.HISTORY}`,
  },
  {
    canActivate: [postAuthorGuard],
    loadComponent: () =>
      import('./post/pages/post-analytics/post-analytics.component').then((c) => c.PostAnalyticsComponent),
    path: `${APP_PATH.POSTS.toLowerCase()}/:id/${APP_PATH.ANALYTICS.toLowerCase()}`,
  },
  {
    canActivate: [postMainAuthorGuard],
    loadComponent: () =>
      import('./post/pages/post-versions/post-versions.component').then((c) => c.PostVersionsComponent),
    path: `${APP_PATH.POSTS.toLowerCase()}/:id/${APP_PATH.VERSIONS.toLowerCase()}`,
    title: `Post | ${APP_PATH.VERSIONS}`,
  },
  {
    canActivate: [postMainAuthorGuard],
    loadComponent: () =>
      import('./post/pages/post-version-diff/post-version-diff.component').then((c) => c.PostVersionDiffComponent),
    path: `${APP_PATH.POSTS.toLowerCase()}/:id/${APP_PATH.VERSION_DIFF.toLowerCase()}`,
    title: `Post | ${APP_PATH.VERSIONS} | Diff`,
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
    title: APP_PATH.ADMIN,
  },
  {
    canActivate: [moderatorGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: MODERATOR_PATH.POSTS.toLowerCase(),
      },
      {
        loadComponent: () =>
          import('./moderator/pages/posts-moderation/posts-moderation.component').then(
            (c) => c.PostsModerationComponent,
          ),
        path: MODERATOR_PATH.POSTS.toLowerCase(),
        title: `Moderator | ${MODERATOR_PATH.POSTS}`,
      },
      {
        loadComponent: () =>
          import('./moderator/pages/post-moderation-detailed/post-moderation-detailed.component').then(
            (c) => c.PostModerationDetailedComponent,
          ),
        path: `${MODERATOR_PATH.POSTS.toLowerCase()}/:id`,
        title: `Moderator | ${MODERATOR_PATH.POSTS.slice(0, -1)}`,
      },
    ],
    loadComponent: () =>
      import('./moderator/layout/moderator-layout/moderator-layout.component').then((c) => c.ModeratorLayoutComponent),
    path: APP_PATH.MODERATOR.toLowerCase(),
    title: APP_PATH.MODERATOR,
  },
  {
    loadComponent: () => import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    path: APP_PATH.NOT_FOUND,
    title: APP_PATH.NOT_FOUND,
  },
  {
    loadComponent: () => import('./core/pages/forbidden/forbidden.component').then((c) => c.ForbiddenComponent),
    path: APP_PATH.FORBIDDEN,
    title: APP_PATH.FORBIDDEN,
  },
  {
    path: APP_PATH.NO_MATCH,
    redirectTo: APP_PATH.NOT_FOUND,
  },
];

export default routes;
