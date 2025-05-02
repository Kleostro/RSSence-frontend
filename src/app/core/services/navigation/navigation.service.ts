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
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  public queryParams = signal<Record<string, string>>({});
  public isLoginPage = signal<boolean>(false);
  public userId = signal<string | null>(null);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const { url } = this.router;
      this.isLoginPage.set(url.startsWith(APP_ROUTE.LOGIN));
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public navigateToLogin(): void {
    this.router.navigate([APP_ROUTE.LOGIN]);
  }

  public navigateToHome(): void {
    this.router.navigate([APP_ROUTE.HOME]);
  }

  public navigateToNotFound(): void {
    this.router.navigate([APP_ROUTE.NOT_FOUND]);
  }

  public navigateToProfile(): void {
    this.router.navigate([APP_ROUTE.PROFILE]);
  }

  public navigateToProfileByUserId(userId: number): void {
    this.router.navigate([APP_ROUTE.PROFILE, userId]);
  }

  public navigateToAuthor(): void {
    this.router.navigate([APP_ROUTE.AUTHOR]);
  }

  public navigateToAuthorByUserId(userId: number): void {
    this.router.navigate([APP_ROUTE.AUTHOR, userId]);
  }

  public updateQueryParams(params: Params): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }

  public parseUserId(userId: string | null): number | null {
    const parsedUserId = Number(userId) || null;

    if (parsedUserId === null) {
      if (userId) {
        this.navigateToNotFound();
      }
      return null;
    }

    return parsedUserId;
  }
}
