import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';
import { TuiRipple } from '@taiga-ui/addon-mobile';
import { TuiButton } from '@taiga-ui/core';

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
