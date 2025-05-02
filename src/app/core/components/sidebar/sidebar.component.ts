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
  selector: 'app-sidebar',
  imports: [DrawerModule, ButtonModule, TieredMenu, BadgeModule, RippleModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  public readonly themeSwitchService = inject(ThemeSwitchService);
  public readonly navigationService = inject(NavigationService);

  public readonly APP_ROUTE = APP_ROUTE;

  public isVisible = false;
  // eslint-disable-next-line max-lines-per-function
  public items = computed<MenuItem[]>(() => [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: [APP_ROUTE.HOME],
    },
    {
      label: 'Feeds',
      icon: 'pi pi-list',
      routerLink: [APP_ROUTE.POSTS],
    },
    { separator: true },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      items: [
        {
          label: 'My profile',
          icon: 'pi pi-user',
          routerLink: [APP_ROUTE.PROFILE],
        },
      ],
    },
    {
      label: 'Author',
      icon: 'pi pi-pencil',
      items: [
        {
          label: 'My author',
          icon: 'pi pi-pencil',
          routerLink: [APP_ROUTE.AUTHOR],
        },
        {
          label: 'My posts',
          icon: 'pi pi-list',
          routerLink: [APP_ROUTE.AUTHOR, this.userService.me()?.id, 'posts'],
          visible: !!this.userService.me()?.author,
        },
      ],
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Switch theme',
          icon: 'pi pi-palette',
          command: (): void => {
            this.themeSwitchService.toggle();
          },
        },
      ],
    },
  ]);

  public logout(): void {
    this.authService.logout().subscribe();
  }
}
