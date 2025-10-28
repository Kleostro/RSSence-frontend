import { ChangeDetectionStrategy, Component, inject, linkedSignal, output } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

import { PostCommentLoaderComponent } from '@/app/post/components/post-comment-loader/post-comment-loader.component';
import { PostCommentComponent } from '@/app/post/components/post-comment/post-comment.component';
import { CommentService } from '@/app/post/services/comment.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostCommentComponent, PostCommentLoaderComponent, PaginatorModule, SkeletonModule],
  selector: 'app-post-comments-list',
  styleUrl: './post-comments-list.component.scss',
  templateUrl: './post-comments-list.component.html',
})
export class PostCommentsListComponent {
  public readonly commentService = inject(CommentService);

  public isCommentsLoaded = linkedSignal({
    computation: () => this.commentService.currentPostCommentResponse() !== null,
    source: this.commentService.currentPostCommentResponse,
  });

  public pageChange = output<PaginatorState>();

  public onPageChange(event: PaginatorState): void {
    this.isCommentsLoaded.set(false);
    this.pageChange.emit(event);
  }
}
