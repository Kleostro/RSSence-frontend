import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WA_WINDOW } from '@ng-web-apis/common';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { UsersService } from '@/app/api/services/users/users.service';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { UserMenuComponent } from '@/app/core/components/user-menu/user-menu.component';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { SidebarService } from '@/app/core/services/sidebar/sidebar.service';
import { WindowSizeService } from '@/app/core/services/window-size/window-size.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, ProgressBar, AvatarModule, TooltipModule, ButtonModule, RippleModule, UserMenuComponent],
  selector: 'app-header',
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public readonly loaderService = inject(LoaderService);
  public readonly sidebarService = inject(SidebarService);
  public readonly usersService = inject(UsersService);
  public readonly window = inject(WA_WINDOW);
  public readonly windowSizeService = inject(WindowSizeService);
}
