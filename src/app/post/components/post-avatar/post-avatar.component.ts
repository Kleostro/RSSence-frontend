import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostsResponse } from '@/app/api/schemas/posts-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, RouterLink, DatePipe],
  selector: 'app-post-avatar',
  styleUrl: './post-avatar.component.scss',
  templateUrl: './post-avatar.component.html',
})
export class PostAvatarComponent {
  public author = input.required<AuthorsResponse>();
  public post = input.required<PostsResponse>();
}
