import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TuiRipple } from '@taiga-ui/addon-mobile';
import { TuiButton } from '@taiga-ui/core';

import { ThemeSwitchService } from '../../services/theme-switch/theme-switch.service';

@Component({
  selector: 'app-header',
  imports: [TuiButton, TuiRipple],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public themeSwitchService = inject(ThemeSwitchService);
}
