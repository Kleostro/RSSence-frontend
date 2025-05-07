import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil, tap } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';
import { PostFacadeService } from '@/app/post/services/post-facade/post-facade.service';
import { PostService } from '@/app/post/services/post/post.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostsListComponent, ButtonModule, RippleModule],
  selector: 'app-posts',
  styleUrl: './posts.component.scss',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly postFacade = inject(PostFacadeService);
  private currentAuthor = signal<AuthorsResponse | null>(null);
  public readonly navigationService = inject(NavigationService);
  public readonly postService = inject(PostService);
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
    this.postFacade
      .loadInitialDataWithDependencies(userId)
      .pipe(
        takeUntil(this.destroy$),
        tap(({ authors }) => {
          this.currentAuthor.set(authors.find((author) => author.userId === userId) ?? null);
        }),
      )
      .subscribe();
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const { page = 1, rows } = event;
    this.postService
      .getAllPosts(this.userId() ? this.currentAuthor()?.id : undefined, { limit: rows, page: page + 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
