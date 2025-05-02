import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostsResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';

@Component({
  selector: 'app-post-preview',
  imports: [CoauthorsListComponent, PostAvatarComponent, RouterLink, ButtonModule, RippleModule, NgIf],
  templateUrl: './post-preview.component.html',
  styleUrl: './post-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPreviewComponent {
  public post = input.required<PostsResponse>();
  public author = input.required<AuthorsResponse | null>();

  public readonly authorService = inject(AuthorService);

  public isShortCoauthors = signal<boolean>(true);
}
