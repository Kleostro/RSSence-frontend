import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule],
  selector: 'app-post-comment-loader',
  styleUrl: './post-comment-loader.component.scss',
  templateUrl: './post-comment-loader.component.html',
})
export class PostCommentLoaderComponent {}
