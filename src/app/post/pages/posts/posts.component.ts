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
  selector: 'app-posts',
  imports: [PostsListComponent, ButtonModule, RippleModule, NgIf],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnDestroy {
  public userId = input<string | null>(null, { alias: 'id' });

  public readonly postService = inject(PostService);
  public readonly navigationService = inject(NavigationService);
  private readonly postFacade = inject(PostFacadeService);

  private readonly destroy$ = new Subject<void>();

  public postsListMode = signal<'preview' | 'full'>('preview');

  constructor() {
    toObservable(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId) => {
        this.navigationService.userId.set(userId);
        const parsedUserId = this.navigationService.parseUserId(userId);
        this.loadInitialData(parsedUserId);
      });
  }

  private loadInitialData(userId: number | null): void {
    this.postFacade.loadInitialDataWithDependencies(userId).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
