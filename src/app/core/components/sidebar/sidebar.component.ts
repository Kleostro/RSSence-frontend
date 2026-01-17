import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WA_WINDOW } from '@ng-web-apis/common';

import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';

import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { ROLE } from '@/app/constants/roles';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { SidebarService } from '@/app/core/services/sidebar/sidebar.service';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

const MOBILE_BREACKPOINT = 991;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DrawerModule, ButtonModule, PanelMenuModule, BadgeModule, RippleModule],
  selector: 'app-sidebar',
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly rolesService = inject(RolesService);
  private readonly usersService = inject(UsersService);
  private readonly window = inject(WA_WINDOW);
  public readonly APP_ROUTE = APP_ROUTE;
  public readonly authService = inject(AuthService);

  public readonly navigationService = inject(NavigationService);
  public readonly sidebarService = inject(SidebarService);
  public readonly themeSwitchService = inject(ThemeSwitchService);

  public isVisible = false;
  // eslint-disable-next-line max-lines-per-function
  public items = computed<MenuItem[]>(() => [
    {
      command: (): void => {
        if (this.window.innerWidth <= MOBILE_BREACKPOINT) {
          this.sidebarService.toggle();
        }
      },
      icon: 'pi pi-home',
      label: 'Home',
      routerLink: [APP_ROUTE.HOME],
      routerLinkActiveOptions: { exact: true, pathMatch: 'full' },
    },
    {
      command: (): void => {
        if (this.window.innerWidth <= MOBILE_BREACKPOINT) {
          this.sidebarService.toggle();
        }
      },
      icon: 'pi pi-list',
      label: 'Feeds',
      routerLink: [APP_ROUTE.POSTS],
    },
    {
      icon: 'pi pi-user',
      items: [
        {
          command: (): void => {
            if (this.window.innerWidth <= MOBILE_BREACKPOINT) {
              this.sidebarService.toggle();
            }
          },
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
          command: (): void => {
            if (this.window.innerWidth <= MOBILE_BREACKPOINT) {
              this.sidebarService.toggle();
            }
          },
          icon: 'pi pi-pencil',
          label: 'My author',
          routerLink: [APP_ROUTE.AUTHOR],
        },
      ],
      label: 'Author',
    },
    {
      icon: 'pi pi-crown',
      items: [
        {
          command: (): void => {
            if (this.window.innerWidth <= MOBILE_BREACKPOINT) {
              this.sidebarService.toggle();
            }
          },
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
          command: (): void => {
            if (this.window.innerWidth <= MOBILE_BREACKPOINT) {
              this.sidebarService.toggle();
            }
          },
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
    this.authService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
