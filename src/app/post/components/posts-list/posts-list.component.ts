import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  inject,
  input,
  linkedSignal,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

import { PaginatedPostResponse } from '@/app/api/schemas/posts-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginatorModule, SkeletonModule, NgTemplateOutlet],
  selector: 'app-posts-list',
  styleUrl: './posts-list.component.scss',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent implements OnInit {
  @ContentChild(TemplateRef) public itemTemplate!: TemplateRef<unknown>;
  @Output() public pageChangeEvent = new EventEmitter<PaginatorState>();
  public readonly navigationService = inject(NavigationService);
  public first = 0;

  public paginatedPostResponse = input<null | PaginatedPostResponse>(null);

  public isPostsLoaded = linkedSignal({
    computation: () => this.paginatedPostResponse() !== null,
    source: this.paginatedPostResponse,
  });

  public handleMoveToPost(postId: number): void {
    if (this.navigationService.isPostModerationPage()) {
      this.navigationService.navigateToPostModerationById(postId);
    } else {
      this.navigationService.navigateToPostById(postId);
    }
  }

  public ngOnInit(): void {
    this.isPostsLoaded.set(true);
  }

  public onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.isPostsLoaded.set(false);
    this.pageChangeEvent.emit(event);
  }
}
