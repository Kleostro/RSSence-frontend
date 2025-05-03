import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { SidebarComponent } from '@/app/core/components/sidebar/sidebar.component';
import { LoaderService } from '@/app/core/services/loader/loader.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, SidebarComponent, ProgressBar],
  selector: 'app-header',
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public readonly loaderService = inject(LoaderService);
}
