import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  public themeSwitchService = inject(ThemeSwitchService);
  public APP_ROUTE = APP_ROUTE;

  public logout(): void {
    this.authService.logout().subscribe();
  }
}
