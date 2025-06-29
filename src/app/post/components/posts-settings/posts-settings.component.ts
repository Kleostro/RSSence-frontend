import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PostSearchComponent } from '@/app/post/components/post-search/post-search.component';
import { PostSortComponent } from '@/app/post/components/post-sort/post-sort.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostSearchComponent, PostSortComponent],
  selector: 'app-posts-settings',
  styleUrl: './posts-settings.component.scss',
  templateUrl: './posts-settings.component.html',
})
export class PostsSettingsComponent {}
