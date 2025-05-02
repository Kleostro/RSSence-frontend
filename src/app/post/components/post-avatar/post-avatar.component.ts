import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostsResponse } from '@/app/api/schemas/posts-response';

@Component({
  selector: 'app-post-avatar',
  imports: [Avatar, RouterLink, DatePipe],
  templateUrl: './post-avatar.component.html',
  styleUrl: './post-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostAvatarComponent {
  public post = input.required<PostsResponse>();
  public author = input.required<AuthorsResponse>();
}
