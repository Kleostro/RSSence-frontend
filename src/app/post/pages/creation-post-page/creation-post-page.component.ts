import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostFormComponent, ButtonModule, RippleModule],
  selector: 'app-creation-post-page',
  styleUrl: './creation-post-page.component.scss',
  templateUrl: './creation-post-page.component.html',
})
export class CreationPostPageComponent {
  public readonly navigationService = inject(NavigationService);
}
