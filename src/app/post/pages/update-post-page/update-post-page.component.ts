import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostFormComponent, ButtonModule, RippleModule],
  selector: 'app-update-post-page',
  styleUrl: './update-post-page.component.scss',
  templateUrl: './update-post-page.component.html',
})
export class UpdatePostPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);
  public currentPost = signal<null | PostResponse | undefined>(undefined);
  public postId = input<null | string>(null, { alias: 'id' });

  public ngOnInit(): void {
    const postId = this.postId();

    if (!postId) {
      return;
    }
    this.postsService
      .getPostById(+postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((post) => {
        this.currentPost.set(post);
      });
  }
}
