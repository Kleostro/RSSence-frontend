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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoauthorsListComponent, PostAvatarComponent, RouterLink, ButtonModule, RippleModule, NgIf],
  selector: 'app-post-preview',
  styleUrl: './post-preview.component.scss',
  templateUrl: './post-preview.component.html',
})
export class PostPreviewComponent {
  public readonly authorService: AuthorService = inject(AuthorService);

  public author = input.required<AuthorsResponse | null>();
  public isShortCoauthors = signal<boolean>(true);
  public post = input.required<PostsResponse>();
}
