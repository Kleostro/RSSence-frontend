import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitchService {
  private readonly document = inject(DOCUMENT);
  private readonly key = 'app-theme';
  private readonly localStorage = inject(WA_LOCAL_STORAGE);
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');

  private isDarkTheme = false;

  constructor() {
    const savedTheme = this.localStorage.getItem(this.key);
    if (!savedTheme) {
      this.isDarkTheme = this.isDarkPreferred();
    } else {
      this.isDarkTheme = savedTheme === 'dark';
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    const htmlElement = this.document.querySelector('html');
    htmlElement?.classList.toggle('app-dark', this.isDarkTheme);
  }

  private isDarkPreferred(): boolean {
    return this.media.matches;
  }

  public toggle(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.localStorage.setItem(this.key, this.isDarkTheme ? 'dark' : 'light');
  }
}
