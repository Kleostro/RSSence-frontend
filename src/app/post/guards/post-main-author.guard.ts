import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { forkJoin, of, switchMap } from 'rxjs';

import { PostsService } from '@/app/api/services/posts/posts.service';
import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { ROLE } from '@/app/constants/roles';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';

export const postMainAuthorGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const usersService = inject(UsersService);
  const postService = inject(PostsService);
  const rolesService = inject(RolesService);
  const router = inject(Router);
  const paramId = route.paramMap.get('id');

  let postIdOrSlug = null;
  if (paramId) {
    if (/^\d+$/.test(paramId)) {
      postIdOrSlug = parseInt(paramId, 10);
    } else {
      postIdOrSlug = paramId;
    }

    const action =
      typeof postIdOrSlug === 'string'
        ? postService.getPostBySlug(postIdOrSlug)
        : postService.getPostById(postIdOrSlug);

    return forkJoin([usersService.getMe(), action]).pipe(
      switchMap(([me, post]) => {
        if (
          rolesService.hasAccess(me?.roles ?? [], ROLE.MODERATOR) ||
          me?.author?.id === post.authors.find((author) => author.isMainAuthor)?.authorId
        ) {
          return of(true);
        }
        return of(router.createUrlTree([APP_ROUTE.FORBIDDEN]));
      }),
    );
  }

  return of(false);
};
