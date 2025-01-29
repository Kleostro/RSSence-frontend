import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitchService {
  private readonly document = inject(DOCUMENT);
  private readonly localStorage = inject(WA_LOCAL_STORAGE);
  private readonly key = 'app-theme';
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');

  private isDarkTheme = false;

  constructor() {
    const savedTheme = this.localStorage.getItem(this.key);
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
    } else if (savedTheme === 'light') {
      this.isDarkTheme = false;
    } else {
      this.isDarkTheme = this.isDarkPreferred();
    }
    this.applyTheme();
  }

  private isDarkPreferred(): boolean {
    return this.media.matches;
  }

  private applyTheme(): void {
    const htmlElement = this.document.querySelector('html');
    if (this.isDarkTheme) {
      htmlElement?.classList.add('app-dark');
    } else {
      htmlElement?.classList.remove('app-dark');
    }
  }

  public toggle(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.localStorage.setItem(this.key, this.isDarkTheme ? 'dark' : 'light');
  }
}
