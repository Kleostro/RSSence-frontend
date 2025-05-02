import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isProcessing = signal(false);
  public isPageLoading = signal(false);

  public turnOn(): void {
    this.isProcessing.set(true);
  }

  public turnOff(): void {
    this.isProcessing.set(false);
  }

  public turnOnPageLoading(): void {
    this.isPageLoading.set(true);
  }

  public turnOffPageLoading(): void {
    this.isPageLoading.set(false);
  }
}
