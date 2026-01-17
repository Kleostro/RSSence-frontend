import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { AuthorResponse } from '@/app/api/schemas/authors-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarModule, RouterLink, TooltipModule],
  selector: 'app-post-avatar',
  styleUrl: './post-avatar.component.scss',
  templateUrl: './post-avatar.component.html',
})
export class PostAvatarComponent {
  public author = input.required<AuthorResponse | null>();
  public avatarSize = input<'large' | 'normal' | 'xlarge'>('normal');
}
