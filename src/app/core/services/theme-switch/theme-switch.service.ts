import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitchService {
  private readonly document = inject(DOCUMENT);

  constructor() {
    if (this.isDarkPreferred()) {
      this.toggle();
    }
  }

  private isDarkPreferred(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  public toggle(): void {
    this.document.querySelector('html')?.classList.toggle('app-dark');
  }
}
