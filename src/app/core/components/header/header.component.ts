import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { SidebarComponent } from '@/app/core/components/sidebar/sidebar.component';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, RouterLink, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public readonly themeSwitchService = inject(ThemeSwitchService);
  public readonly APP_ROUTE = APP_ROUTE;
}
