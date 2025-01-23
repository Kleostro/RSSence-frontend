import { inject, Injectable, OnInit } from '@angular/core';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';

import { TUI_DARK_MODE, TUI_DARK_MODE_KEY } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitchService implements OnInit {
  private readonly key = inject(TUI_DARK_MODE_KEY);
  private readonly storage = inject(WA_LOCAL_STORAGE);
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');

  public readonly darkMode = inject(TUI_DARK_MODE);

  public ngOnInit(): void {
    this.darkMode.set(this.media.matches);
  }

  public toggle(): void {
    this.storage.removeItem(this.key);
    this.darkMode.set(!this.darkMode());
  }
}
