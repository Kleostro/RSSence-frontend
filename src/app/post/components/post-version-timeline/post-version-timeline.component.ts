import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';

import { PostVersionResponse } from '@/app/api/schemas/post/post-version-response';
import { PostResponse } from '@/app/api/schemas/post/posts-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, RippleModule, DatePipe, TooltipModule, Timeline, TagModule],
  selector: 'app-post-version-timeline',
  styleUrl: './post-version-timeline.component.scss',
  templateUrl: './post-version-timeline.component.html',
})
export class PostVersionTimelineComponent {
  public currentPost = input<null | PostResponse>(null);
  public deleteVersion = output<PostVersionResponse>();
  public isProcessing = input<boolean>(false);
  public revertVersion = output<PostVersionResponse>();
  public selectedVersions = input<number[]>([]);
  public selectVersion = output<{ isSelected: boolean; version: number }>();
  public versions = input<PostVersionResponse[]>([]);
}
