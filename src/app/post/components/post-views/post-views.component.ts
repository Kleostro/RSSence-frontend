import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipModule],
  selector: 'app-post-views',
  styleUrl: './post-views.component.scss',
  templateUrl: './post-views.component.html',
})
export class PostViewsComponent {
  public readonly navigationService = inject(NavigationService);
  public post = input<null | PostResponse>(null);
}
