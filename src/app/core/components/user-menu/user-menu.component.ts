import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { UsersService } from '@/app/api/services/users/users.service';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopoverModule, ButtonModule, RippleModule, AvatarModule, ButtonModule, TooltipModule],
  selector: 'app-user-menu',
  styleUrl: './user-menu.component.scss',
  templateUrl: './user-menu.component.html',
})
export class UserMenuComponent {
  private readonly destroyRef = inject(DestroyRef);
  public readonly authService = inject(AuthService);
  public readonly navigationService = inject(NavigationService);
  public readonly usersService = inject(UsersService);

  public logout(): void {
    this.authService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
