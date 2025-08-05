import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';
import { TieredMenu } from 'primeng/tieredmenu';

import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { ROLE } from '@/app/constants/roles';
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
  private readonly rolesService = inject(RolesService);
  private readonly usersService = inject(UsersService);

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
      ],
      label: 'Author',
      visible: !!this.usersService.me()?.profile,
    },
    {
      icon: 'pi pi-crown',
      items: [
        {
          icon: 'pi pi-users',
          label: 'Users',
          routerLink: [APP_ROUTE.USERS],
        },
        {
          separator: true,
        },
      ],
      label: 'Admin',
      visible: this.rolesService.hasAccess(this.usersService.me()?.roles ?? [], ROLE.ADMIN),
    },

    {
      icon: 'pi pi-shield',
      items: [
        {
          icon: 'pi pi-list-check',
          label: 'Post moderation',
          routerLink: [APP_ROUTE.POST_MODERATION],
        },
        {
          separator: true,
        },
      ],
      label: 'Moderator',
      visible: this.rolesService.hasAccess(this.usersService.me()?.roles ?? [], ROLE.MODERATOR),
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
