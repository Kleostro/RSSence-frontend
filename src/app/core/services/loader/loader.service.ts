import { inject, Injectable, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly router = inject(Router);
  public isPageLoading = signal(false);
  public isProcessing = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isPageLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isPageLoading.set(false);
      }
    });
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
