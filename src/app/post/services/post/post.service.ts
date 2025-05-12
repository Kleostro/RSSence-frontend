import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, EMPTY, finalize, Observable, take, tap } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PaginatedPostResponse, PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NewPost } from '@/app/post/interfaces/post-form';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly loaderService = inject(LoaderService);
  private readonly message = inject(MessageService);
  private readonly postsService = inject(PostsService);

  private handleError(error: OverriddenHttpErrorResponse): Observable<never> {
    this.message.error(error.error.message);
    return EMPTY;
  }

  public createPost(dto: NewPost): Observable<PostResponse> {
    this.loaderService.turnOn();
    return this.postsService.createPost(dto).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.CREATE_POST_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public deletePost(postId: number): Observable<PostResponse> {
    this.loaderService.turnOn();
    return this.postsService.deletePost(postId).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.DELETE_POST_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getAllPosts(query?: PaginationQueryDto): Observable<PaginatedPostResponse> {
    this.loaderService.turnOn();
    return this.postsService.getAllPosts(query).pipe(
      take(1),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getPostById(postId: number): Observable<PostResponse> {
    this.loaderService.turnOn();
    return this.postsService.getPostById(postId).pipe(
      take(1),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public updatePost(dto: FormData): Observable<PostResponse> {
    this.loaderService.turnOn();
    return this.postsService.updatePost(dto).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.UPDATE_POST_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }
}
