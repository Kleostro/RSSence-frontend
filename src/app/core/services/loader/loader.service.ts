import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isPageLoading = signal(false);
  public isProcessing = signal(false);

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
