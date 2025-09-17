import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, map, tap } from 'rxjs';

import { PostQuery } from '@/app/api/interfaces/post-query';
import { PaginatedPostVersionResponse, PostVersionResponse } from '@/app/api/schemas/post-version-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
// eslint-disable-next-line max-len
import { PostVersionTimelineComponent } from '@/app/post/components/post-version-timeline/post-version-timeline.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, RippleModule, TooltipModule, PostVersionTimelineComponent, Paginator],
  selector: 'app-post-versions',
  styleUrl: './post-versions.component.scss',
  templateUrl: './post-versions.component.html',
})
export class PostVersionsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postsService = inject(PostsService);
  public readonly navigationService = inject(NavigationService);
  public first = 0;
  public isProcessing = signal<boolean>(false);
  public paginatedPostVersionResponse = signal<null | PaginatedPostVersionResponse>(null);
  public pageTitle = computed(() => {
    const postTitle = this.paginatedPostVersionResponse()?.items.find((v) => v.isCurrent)?.title ?? '';
    return `Versions of "${postTitle}"`;
  });
  public postId = input<null | string>(null, { alias: 'id' });
  public selectedVersions = signal<number[]>([]);

  public compareVersions(): void {
    const [from, to] = this.selectedVersions().sort((a, b) => a - b);
    const postId = this.postId();

    if (postId) {
      this.navigationService.updateQueryParams({ from: from, to: to });
      this.navigationService.navigateToPostVersionDiff(+postId, from, to);
    }
  }

  public deleteVersion(version: PostVersionResponse): void {
    const postId = this.postId();
    if (postId) {
      this.isProcessing.set(true);
      this.postsService
        .deletePostVersion(+postId, version.version)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map(() => {
            this.selectedVersions.set([]);
            this.getCurrentPostVersions();
          }),
          finalize(() => {
            this.isProcessing.set(false);
          }),
        )
        .subscribe();
    }
  }

  public getCurrentPostVersions(query?: PostQuery): void {
    const postId = this.postId();
    if (postId) {
      this.postsService
        .getVersionsByPost(+postId, query)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((response: null | PaginatedPostVersionResponse) => {
            this.paginatedPostVersionResponse.set(response);
          }),
        )
        .subscribe();
    }
  }

  public ngOnInit(): void {
    this.getCurrentPostVersions();
  }

  public onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;

    const { page = 1, rows } = event;
    this.getCurrentPostVersions({ limit: rows, page: page + 1 });
  }

  public onVersionSelected({ isSelected, version }: { isSelected: boolean; version: number }): void {
    const current = this.selectedVersions();

    if (isSelected) {
      if (current.length < 2) {
        this.selectedVersions.update((v) => [...v, version]);
      }
    } else {
      this.selectedVersions.update((v) => v.filter((v) => v !== version));
    }
  }

  public revertVersion(version: PostVersionResponse): void {
    const postId = this.postId();
    if (postId) {
      this.isProcessing.set(true);
      this.postsService
        .revertToVersion(+postId, version.version)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map(() => {
            this.selectedVersions.set([]);
            this.getCurrentPostVersions();
          }),
          finalize(() => {
            this.isProcessing.set(false);
          }),
        )
        .subscribe();
    }
  }
}
