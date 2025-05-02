import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { concatMap, finalize, Subject, takeUntil } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostsResponse } from '@/app/api/schemas/posts-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { PostService } from '@/app/post/services/post/post.service';

@Component({
  selector: 'app-post',
  imports: [CoauthorsListComponent, NgIf, ButtonModule, RippleModule, PostAvatarComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnDestroy {
  public post = input.required<PostsResponse | null>();
  public author = input.required<AuthorsResponse | null>();
  public isProcessing = signal<boolean>(false);

  public readonly sanitizer = inject(DomSanitizer);
  public readonly userService = inject(UserService);
  private readonly postService = inject(PostService);

  public isShortCoauthors = signal<boolean>(true);

  private readonly destroy$ = new Subject<void>();

  // TBD: fix deleting a post on the detailed page of a post
  public deletePost(post: PostsResponse): void {
    this.isProcessing.set(true);
    this.postService
      .deletePost(post.id)
      .pipe(
        concatMap(() => this.postService.refreshPosts()),
        takeUntil(this.destroy$),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
