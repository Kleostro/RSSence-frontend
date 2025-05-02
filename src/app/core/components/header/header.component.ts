import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { SidebarComponent } from '@/app/core/components/sidebar/sidebar.component';
import { LoaderService } from '@/app/core/services/loader/loader.service';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, SidebarComponent, ProgressBar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public readonly loaderService = inject(LoaderService);
}
