import { Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { filter } from 'rxjs';

import { APP_ROUTE } from '@/app/core/services/navigation/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  public isLoginPage = signal<boolean>(false);
  public isPostDetailedPage = signal<boolean>(false);
  public queryParams = signal<Record<string, string>>({});

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const { url } = this.router;

      this.isPostDetailedPage.set(url.startsWith(APP_ROUTE.POSTS + '/'));
      this.isLoginPage.set(url.startsWith(APP_ROUTE.LOGIN));
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

  public navigateToPostById(postId: number): void {
    this.router.navigate([APP_ROUTE.POSTS, postId]);
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
    });
  }
}
