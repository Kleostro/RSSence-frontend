import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Ripple } from 'primeng/ripple';
import { TieredMenu } from 'primeng/tieredmenu';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

@Component({
  selector: 'app-sidebar',
  imports: [DrawerModule, ButtonModule, TieredMenu, BadgeModule, Ripple, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  public readonly themeSwitchService = inject(ThemeSwitchService);
  public readonly APP_ROUTE = APP_ROUTE;

  public IsVisible = false;

  public items: MenuItem[] = [];

  public logout(): void {
    this.authService.logout().subscribe();
  }
}
