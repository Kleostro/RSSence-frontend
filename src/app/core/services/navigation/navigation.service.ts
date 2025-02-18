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

  public navigateToProfile(): void {
    this.router.navigate([APP_ROUTE.PROFILE]);
  }

  public navigateToProfileMe(): void {
    this.router.navigate([APP_ROUTE.PROFILE_ME]);
  }

  public navigateToProfileSettings(): void {
    this.router.navigate([APP_ROUTE.PROFILE_SETTINGS]);
  }

  public updateQueryParams(params: Params): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }
}
