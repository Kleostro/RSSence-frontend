import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PostSearchComponent } from '@/app/post/components/post-search/post-search.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostSearchComponent],
  selector: 'app-posts-settings',
  styleUrl: './posts-settings.component.scss',
  templateUrl: './posts-settings.component.html',
})
export class PostsSettingsComponent {}
