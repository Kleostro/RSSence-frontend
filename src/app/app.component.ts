import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TuiRoot } from '@taiga-ui/core';

import { HeaderComponent } from './core/components/header/header.component';
import { ThemeSwitchService } from './core/services/theme-switch/theme-switch.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly title = 'RSSence-frontend';

  public themeSwitchService = inject(ThemeSwitchService);
}
