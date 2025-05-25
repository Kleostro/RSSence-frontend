import { inject, Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedPostResponse, PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { NewPost } from '@/app/post/interfaces/post-form';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly message = inject(MessageService);
  private readonly postsService = inject(PostsService);

  public createPost(dto: NewPost): Observable<PostResponse> {
    return this.postsService.createPost(dto).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_POST_SUCCESS);
      }),
    );
  }

  public deletePost(postId: number): Observable<PostResponse> {
    return this.postsService.deletePost(postId).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_POST_SUCCESS);
      }),
    );
  }

  public getAllPosts(query?: PaginationQueryDto): Observable<PaginatedPostResponse> {
    return this.postsService.getAllPosts(query);
  }

  public getPostById(postId: number): Observable<PostResponse> {
    return this.postsService.getPostById(postId);
  }

  public updatePost(dto: FormData): Observable<PostResponse> {
    return this.postsService.updatePost(dto).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_POST_SUCCESS);
      }),
    );
  }
}
