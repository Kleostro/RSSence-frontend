import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';

import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostFacadeService } from '@/app/post/services/post-facade/post-facade.service';
import { PostService } from '@/app/post/services/post/post.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostsListComponent, ButtonModule, RippleModule, NgIf],
  selector: 'app-posts',
  styleUrl: './posts.component.scss',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly postFacade = inject(PostFacadeService);

  public readonly navigationService = inject(NavigationService);
  public readonly postService = inject(PostService);

  public postsListMode = signal<'full' | 'preview'>('preview');
  public userId = input<null | string>(null, { alias: 'id' });

  constructor() {
    toObservable(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId) => {
        this.navigationService.userId.set(userId);
        const parsedUserId = this.navigationService.parseUserId(userId);
        this.loadInitialData(parsedUserId);
      });
  }

  private loadInitialData(userId: null | number): void {
    this.postFacade.loadInitialDataWithDependencies(userId).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
