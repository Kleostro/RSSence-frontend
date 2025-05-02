import { inject, Injectable } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { concatMap, finalize, forkJoin, map, Observable, of, tap } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
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
export class AuthorFacadeService {
  private readonly authorService = inject(AuthorService);
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private readonly loaderService = inject(LoaderService);

  public getNavigationItems(
    navigateToProfile: () => void,
    editProfile: () => void,
    deleteProfile: () => void,
  ): MenuItem[] {
    return [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: navigateToProfile,
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: editProfile,
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: deleteProfile,
      },
    ];
  }

  private loadInitialData(userId: number | null): Observable<UsersResponse | null> {
    this.loaderService.turnOnPageLoading();
    return this.userService.getMe().pipe(
      concatMap((userMe) => {
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

  public loadInitialDataWithDependencies(userId: number | null): Observable<{
    user: UsersResponse | null;
    authors: AuthorsResponse[];
    posts: PostsResponse[];
  }> {
    this.loaderService.turnOnPageLoading();
    return this.loadInitialData(userId).pipe(
      concatMap((user) => {
        if (!user?.author?.id) {
          return of({ user, authors: [], posts: [] });
        }

        return forkJoin({
          authors: this.getAllAuthors(),
          posts: this.postService.getPostsByAuthorId(user.author.id),
        }).pipe(
          map(({ authors, posts }) => ({
            user,
            authors: authors.filter((author) => author.id !== user.author?.id),
            posts,
          })),
          finalize(() => {
            this.loaderService.turnOffPageLoading();
          }),
        );
      }),
    );
  }

  public getAllAuthors(): Observable<AuthorsResponse[]> {
    this.loaderService.turnOnPageLoading();
    return this.authorService.getAuthors().pipe(
      finalize(() => {
        this.loaderService.turnOffPageLoading();
      }),
    );
  }

  public deleteAuthor(): Observable<AuthorsResponse> {
    return this.authorService.deleteAuthor().pipe(
      tap(() => {
        const previousMe = this.userService.me();
        if (previousMe) {
          this.userService.me.set({
            ...previousMe,
            author: null,
          });
        }
      }),
    );
  }

  public handleAuthorFormSubmit(formData: FormData, isUpdate: boolean): Observable<AuthorsResponse> {
    const action$ = isUpdate ? this.authorService.updateAuthor(formData) : this.authorService.createAuthor(formData);

    return action$.pipe(
      tap((updatedOrNewAuthor) => {
        const previousMe = this.userService.me();
        if (previousMe) {
          this.userService.me.set({
            ...previousMe,
            author: updatedOrNewAuthor,
          });
        }
      }),
    );
  }
}
