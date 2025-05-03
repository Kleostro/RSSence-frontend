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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoauthorsListComponent, NgIf, ButtonModule, RippleModule, PostAvatarComponent],
  selector: 'app-post',
  styleUrl: './post.component.scss',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly postService = inject(PostService);

  public readonly sanitizer = inject(DomSanitizer);
  public readonly userService = inject(UserService);

  public author = input.required<AuthorsResponse | null>();
  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public post = input.required<null | PostsResponse>();

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
