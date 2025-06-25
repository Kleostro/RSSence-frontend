import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';

import { AuthorResponse } from '@/app/api/schemas/authors-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, RouterLink],
  selector: 'app-post-avatar',
  styleUrl: './post-avatar.component.scss',
  templateUrl: './post-avatar.component.html',
})
export class PostAvatarComponent {
  public author = input.required<AuthorResponse | null>();
}
