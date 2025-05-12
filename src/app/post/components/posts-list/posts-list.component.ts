import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, linkedSignal, Output } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostComponent, PaginatorModule, SkeletonModule],
  selector: 'app-posts-list',
  styleUrl: './posts-list.component.scss',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  @Output() public pageChangeEvent = new EventEmitter<PaginatorState>();
  public readonly authorService = inject(AuthorService);
  public readonly navigationService = inject(NavigationService);

  public first = 0;

  public paginatedPostResponse = input<null | PaginatedPostResponse>(null);

  public isPostsLoaded = linkedSignal({
    computation: () => true,
    source: this.paginatedPostResponse,
  });

  public onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.isPostsLoaded.set(false);
    this.pageChangeEvent.emit(event);
  }
}
