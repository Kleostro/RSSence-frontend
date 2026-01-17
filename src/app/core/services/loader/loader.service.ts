import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly router = inject(Router);
  private lastRoutePath = '';
  public isPageLoading = signal(false);

  public isProcessing = signal(false);

  constructor() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        const nextRoutePath = event.url.split('?')[0];

        if (nextRoutePath !== this.lastRoutePath) {
          this.isPageLoading.set(true);
          this.lastRoutePath = nextRoutePath;
        }
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isPageLoading.set(false);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public turnOff(): void {
    this.isProcessing.set(false);
  }

  public turnOffPageLoading(): void {
    this.isPageLoading.set(false);
  }

  public turnOn(): void {
    this.isProcessing.set(true);
  }

  public turnOnPageLoading(): void {
    this.isPageLoading.set(true);
  }
}
