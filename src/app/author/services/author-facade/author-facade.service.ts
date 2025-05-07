import { inject, Injectable } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { concatMap, finalize, forkJoin, map, Observable, of, tap } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
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
  private readonly loaderService = inject(LoaderService);
  private readonly navigationService = inject(NavigationService);
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);

  private loadInitialData(userId: null | number): Observable<null | UsersResponse> {
    this.loaderService.turnOnPageLoading();
    return this.userService.getMe().pipe(
      concatMap((userMe) => {
        if (userId && userMe?.id === userId) {
          return of(userMe);
        }

        if (userId) {
          return this.userService.getUserById(userId).pipe(
            map((user) => {
              if (!user?.author) {
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

  public getAllAuthors(): Observable<AuthorsResponse[]> {
    this.loaderService.turnOnPageLoading();
    return this.authorService.getAuthors().pipe(
      finalize(() => {
        this.loaderService.turnOffPageLoading();
      }),
    );
  }

  public getNavigationItems(
    navigateToProfile: () => void,
    editProfile: () => void,
    deleteProfile: () => void,
  ): MenuItem[] {
    return [
      {
        command: navigateToProfile,
        icon: 'pi pi-user',
        label: 'Profile',
      },
      {
        command: editProfile,
        icon: 'pi pi-pencil',
        label: 'Edit',
      },
      {
        command: deleteProfile,
        icon: 'pi pi-trash',
        label: 'Delete',
      },
    ];
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

  public loadInitialDataWithDependencies(userId: null | number): Observable<{
    authors: AuthorsResponse[];
    posts: PostResponse[];
    user: null | UsersResponse;
  }> {
    this.loaderService.turnOnPageLoading();
    return this.loadInitialData(userId).pipe(
      concatMap((user) => {
        if (!user?.author?.id) {
          return of({ authors: [], posts: [], user });
        }

        return forkJoin({
          authors: this.getAllAuthors(),
          posts: this.postService.getAllPosts(user.author.id),
        }).pipe(
          map(({ authors, posts }) => ({
            authors: authors.filter((author) => author.id !== user.author?.id),
            posts: posts.items,
            user,
          })),
          finalize(() => {
            this.loaderService.turnOffPageLoading();
          }),
        );
      }),
    );
  }
}
