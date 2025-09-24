import { Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { filter } from 'rxjs';

import { APP_PATH, APP_ROUTE } from '@/app/core/services/navigation/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  public isLoginPage = signal<boolean>(false);
  public isPostDetailedModerationPage = signal<boolean>(false);
  public isPostDetailedPage = signal<boolean>(false);
  public isPostModerationPage = signal<boolean>(false);
  public queryParams = signal<Record<string, string>>({});
  public queryParams$ = toObservable(this.queryParams);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const { url } = this.router;

      this.isPostDetailedPage.set(url.startsWith(APP_ROUTE.POSTS + '/'));
      this.isLoginPage.set(url.startsWith(APP_ROUTE.LOGIN));
      this.isPostModerationPage.set(url.startsWith(APP_ROUTE.POST_MODERATION));
      this.isPostDetailedModerationPage.set(url.startsWith(APP_ROUTE.POST_MODERATION + '/'));

      this.activatedRoute.queryParams.subscribe((params) => {
        this.queryParams.set(params);
      });
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public navigateToAuthor(): void {
    this.router.navigate([APP_ROUTE.AUTHOR]);
  }

  public navigateToAuthorByUsername(username: null | string): void {
    this.router.navigate([APP_ROUTE.AUTHOR, username]);
  }

  public navigateToHome(): void {
    this.router.navigate([APP_ROUTE.HOME]);
  }

  public navigateToLogin(): void {
    this.router.navigate([APP_ROUTE.LOGIN]);
  }

  public navigateToNotFound(): void {
    this.router.navigate([APP_ROUTE.NOT_FOUND]);
  }

  public navigateToPostAnalytics(postId: null | number): void {
    this.router.navigate([APP_ROUTE.POSTS, postId, APP_PATH.ANALYTICS.toLowerCase()]);
  }

  public navigateToPostBySlug(slug?: string): void {
    this.router.navigate([APP_ROUTE.POSTS, slug]);
  }

  public navigateToPostHistory(postId: null | number): void {
    const url = `${APP_ROUTE.POSTS}/${postId}/${APP_ROUTE.HISTORY}`;

    this.router.navigate([url]);
  }

  public navigateToPostModeration(): void {
    this.router.navigate([APP_ROUTE.POST_MODERATION]);
  }

  public navigateToPostModerationBySlug(slug?: string): void {
    this.router.navigate([APP_ROUTE.POST_MODERATION, slug]);
  }

  public navigateToPostVersionDiff(postId: number, from: number, to: number): void {
    const url = `${APP_ROUTE.POSTS}/${postId}/${APP_ROUTE.VERSION_DIFF}`;
    this.router.navigate([url], { queryParams: { from, to } });
  }

  public navigateToPostVersions(postId: null | number): void {
    const url = `${APP_ROUTE.POSTS}/${postId}/${APP_ROUTE.VERSIONS}`;
    this.router.navigate([url]);
  }

  public navigateToProfile(): void {
    this.router.navigate([APP_ROUTE.PROFILE]);
  }

  public navigateToProfileByUsername(username: null | string): void {
    this.router.navigate([APP_ROUTE.PROFILE, username]);
  }

  public updateQueryParams(params: Params): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      replaceUrl: true,
    });
  }
}
