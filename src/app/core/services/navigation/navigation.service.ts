import { Location } from '@angular/common';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { filter, Subject, takeUntil } from 'rxjs';

import { APP_PATH, APP_ROUTE, MODERATOR_PATH } from '@/app/core/services/navigation/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  public isLoginPage = signal<boolean>(false);
  public isPostDetailedModerationPage = signal<boolean>(false);
  public isPostDetailedPage = signal<boolean>(false);
  public isPostModerationPage = signal<boolean>(false);
  public queryParams = signal<Record<string, string>>({});
  public queryParams$ = toObservable(this.queryParams);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const { url } = this.router;

        this.isPostDetailedPage.set(url.startsWith(APP_ROUTE.POSTS + '/'));
        this.isLoginPage.set(url.startsWith(APP_ROUTE.LOGIN));
        this.isPostModerationPage.set(url.startsWith(APP_ROUTE.POST_MODERATION));
        this.isPostDetailedModerationPage.set(url.startsWith(APP_ROUTE.POST_MODERATION + '/'));

        this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
          this.queryParams.set(params);
        });
      });
  }

  public goBack(): void {
    this.location.back();
  }

  public navigateToAuthor(): void {
    void this.router.navigate([APP_ROUTE.AUTHOR]);
  }

  public navigateToAuthorByUsername(username: null | string): void {
    void this.router.navigate([APP_ROUTE.AUTHOR, username]);
  }

  public navigateToCreationPost(): void {
    void this.router.navigate([APP_ROUTE.POSTS, APP_PATH.PROCESS.toLowerCase(), APP_PATH.CREATION.toLowerCase()]);
  }

  public navigateToForbidden(): void {
    void this.router.navigate([APP_ROUTE.FORBIDDEN]);
  }

  public navigateToHome(): void {
    void this.router.navigate([APP_ROUTE.HOME]);
  }

  public navigateToLogin(): void {
    void this.router.navigate([APP_ROUTE.LOGIN]);
  }

  public navigateToNotFound(): void {
    void this.router.navigate([APP_ROUTE.NOT_FOUND]);
  }

  public navigateToPostAnalytics(postId: null | number): void {
    void this.router.navigate([APP_ROUTE.POSTS, postId, APP_PATH.ANALYTICS.toLowerCase()]);
  }

  public navigateToPostBySlug(slug?: string): void {
    void this.router.navigate([APP_ROUTE.POSTS, slug]);
  }

  public navigateToPostHistory(postId: null | number): void {
    const url = `${APP_ROUTE.POSTS}/${postId}/${APP_ROUTE.HISTORY}`;

    void this.router.navigate([url]);
  }

  public navigateToPostModeration(): void {
    void this.router.navigate([APP_ROUTE.POST_MODERATION]);
  }

  public navigateToPostModerationById(id?: number): void {
    void this.router.navigate([APP_ROUTE.POST_MODERATION, id]);
  }

  public navigateToPostReview(postId: number): void {
    const url = `/${APP_PATH.MODERATOR.toLowerCase()}/${MODERATOR_PATH.POSTS.toLowerCase()}/${postId}/${MODERATOR_PATH.REVIEW.toLowerCase()}`;
    void this.router.navigate([url]);
  }

  public navigateToPostVersionDiff(postId: number, from: number, to: number): void {
    const url = `${APP_ROUTE.POSTS}/${postId}/${APP_ROUTE.VERSION_DIFF}`;
    void this.router.navigate([url], { queryParams: { from, to } });
  }

  public navigateToPostVersions(postId: null | number): void {
    const url = `${APP_ROUTE.POSTS}/${postId}/${APP_ROUTE.VERSIONS}`;
    void this.router.navigate([url]);
  }

  public navigateToProfile(): void {
    void this.router.navigate([APP_ROUTE.PROFILE]);
  }

  public navigateToProfileByUsername(username: null | string): void {
    void this.router.navigate([APP_ROUTE.PROFILE, username]);
  }

  public navigateToRegister(): void {
    void this.router.navigate([APP_ROUTE.REGISTER]);
  }

  public navigateToUpdatePost(postId: null | number): void {
    void this.router.navigate([APP_ROUTE.POSTS, APP_PATH.PROCESS.toLowerCase(), APP_PATH.UPDATE.toLowerCase(), postId]);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateQueryParams(params: Params): void {
    void this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      replaceUrl: true,
    });
  }
}
