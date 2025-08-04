import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';

import { isModerationHistoryResponse, ModerationHistoryResponse } from '@/app/api/schemas/moderation-history-response';
import { isPostHistoryResponse, PostHistoryResponse } from '@/app/api/schemas/post-history';
import { POST_STATUS } from '@/app/api/schemas/posts-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Timeline, ButtonModule, RippleModule, CardModule, TagModule, DatePipe, Avatar, RouterLink],
  selector: 'app-post-history-timeline',
  styleUrl: './post-history-timeline.component.scss',
  templateUrl: './post-history-timeline.component.html',
})
export class PostHistoryTimelineComponent {
  public readonly navigationService = inject(NavigationService);
  public historyResponse = input<(ModerationHistoryResponse | PostHistoryResponse)[] | null | undefined>();
  public isAuthorHistoryResponse = isPostHistoryResponse;
  public isModerationHistoryResponse = isModerationHistoryResponse;

  public getStatusSeverity(status: null | string): string {
    return status === POST_STATUS.APPROVED
      ? 'success'
      : status === POST_STATUS.SUBMITTED
        ? 'info'
        : status === POST_STATUS.REVISION_REQUIRED
          ? 'warn'
          : status === POST_STATUS.REJECTED
            ? 'danger'
            : 'secondary';
  }
}
