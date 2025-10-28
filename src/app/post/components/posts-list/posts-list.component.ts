import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  inject,
  input,
  linkedSignal,
  output,
  TemplateRef,
} from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

import { PaginatedPostResponse } from '@/app/api/schemas/post/posts-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginatorModule, SkeletonModule, NgTemplateOutlet],
  selector: 'app-posts-list',
  styleUrl: './posts-list.component.scss',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  @ContentChild(TemplateRef) public itemTemplate!: TemplateRef<unknown>;
  public readonly navigationService = inject(NavigationService);

  public paginatedPostResponse = input<null | PaginatedPostResponse>(null);

  public isPostsLoaded = linkedSignal({
    computation: () => this.paginatedPostResponse() !== null,
    source: this.paginatedPostResponse,
  });

  public pageChange = output<PaginatorState>();

  public onPageChange(event: PaginatorState): void {
    this.isPostsLoaded.set(false);
    this.pageChange.emit(event);
  }
}
