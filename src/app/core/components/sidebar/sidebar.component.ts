import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';
import { TieredMenu } from 'primeng/tieredmenu';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { UserService } from '@/app/auth/services/user/user.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DrawerModule, ButtonModule, TieredMenu, BadgeModule, RippleModule, RouterLink],
  selector: 'app-sidebar',
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  public readonly APP_ROUTE = APP_ROUTE;
  public readonly navigationService = inject(NavigationService);
  public readonly themeSwitchService = inject(ThemeSwitchService);

  public isVisible = false;
  // eslint-disable-next-line max-lines-per-function
  public items = computed<MenuItem[]>(() => [
    {
      icon: 'pi pi-home',
      label: 'Home',
      routerLink: [APP_ROUTE.HOME],
    },
    {
      icon: 'pi pi-list',
      label: 'Feeds',
      routerLink: [APP_ROUTE.POSTS],
    },
    { separator: true },
    {
      icon: 'pi pi-user',
      items: [
        {
          icon: 'pi pi-user',
          label: 'My profile',
          routerLink: [APP_ROUTE.PROFILE],
        },
      ],
      label: 'Profile',
    },
    {
      icon: 'pi pi-pencil',
      items: [
        {
          icon: 'pi pi-pencil',
          label: 'My author',
          routerLink: [APP_ROUTE.AUTHOR],
        },
        {
          icon: 'pi pi-list',
          label: 'My posts',
          routerLink: [APP_ROUTE.AUTHOR, this.userService.me()?.id, 'posts'],
          visible: !!this.userService.me()?.author,
        },
      ],
      label: 'Author',
    },
    {
      icon: 'pi pi-cog',
      items: [
        {
          command: (): void => {
            this.themeSwitchService.toggle();
          },
          icon: 'pi pi-palette',
          label: 'Switch theme',
        },
      ],
      label: 'Settings',
    },
  ]);

  public logout(): void {
    this.authService.logout().subscribe();
  }
}
