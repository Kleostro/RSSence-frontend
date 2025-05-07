import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostComponent } from '@/app/post/components/post/post.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostComponent, PaginatorModule],
  selector: 'app-posts-list',
  styleUrl: './posts-list.component.scss',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  @Output() public pageChangeEvent = new EventEmitter<PaginatorState>();
  public readonly authorService = inject(AuthorService);
  public readonly navigationService = inject(NavigationService);

  public first = 0;
  public isShowPostActions = input<boolean>(true);

  public paginatedPostResponse = input<null | PaginatedPostResponse>(null);

  public onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.pageChangeEvent.emit(event);
  }
}
