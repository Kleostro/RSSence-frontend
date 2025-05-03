import { inject, Injectable } from '@angular/core';

import { finalize, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { PostsResponse } from '@/app/api/schemas/posts-response';
import { UsersResponse } from '@/app/api/schemas/users-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { AuthorService } from '@/app/author/services/author/author.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostService } from '@/app/post/services/post/post.service';

@Injectable({
  providedIn: 'root',
})
export class PostFacadeService {
  private readonly authorService = inject(AuthorService);
  private readonly loaderService = inject(LoaderService);
  private readonly navigationService = inject(NavigationService);
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);

  private loadInitialData(userId: null | number): Observable<null | UsersResponse> {
    this.loaderService.turnOnPageLoading();
    return this.userService.getMe().pipe(
      switchMap((userMe) => {
        if (userId && userMe?.id === userId) {
          return of(userMe);
        }

        if (userId) {
          return this.userService.getUserById(userId).pipe(
            map((user) => {
              if (!user?.profile) {
                this.navigationService.navigateToNotFound();
                return null;
              }
              return user;
            }),
          );
        }

        return of(userMe ?? null);
      }),
      finalize(() => {
        this.loaderService.turnOffPageLoading();
      }),
    );
  }

  public loadInitialDataWithDependencies(userId: null | number): Observable<{
    posts: PostsResponse[];
  }> {
    this.loaderService.turnOnPageLoading();
    return this.loadInitialData(userId).pipe(
      switchMap((user) => {
        if (!user?.author?.id) {
          return of({ authors: [], posts: [], user });
        }

        return forkJoin({
          authors: this.authorService.getAuthors(),
          posts: userId ? this.postService.getPostsByAuthorId(user.author.id) : this.postService.getAllPosts(),
        }).pipe(
          finalize(() => {
            this.loaderService.turnOffPageLoading();
          }),
        );
      }),
    );
  }
}
