import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedPostResponse, PaginatedPostResponseSchema, PostResponse } from '@/app/api/schemas/posts-response';
import { NewPost } from '@/app/post/interfaces/post-form';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly message = inject(MessageService);
  public query = signal<PaginationQueryDto>({ limit: 10, page: 1 });

  public createPost(post: NewPost): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, post).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_POST_SUCCESS);
      }),
    );
  }

  public deletePost(postId: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_POST_SUCCESS);
      }),
    );
  }

  public getAllPosts(query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.http
      .get<PaginatedPostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, {
        params: { ...query },
      })
      .pipe(
        map((response: PaginatedPostResponse) => {
          const { data, success } = PaginatedPostResponseSchema.safeParse(response);
          return success ? data : null;
        }),
      );
  }

  public getPostById(postId: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`);
  }

  public resetQuery(): void {
    this.query.set({ limit: 10, page: 1 });
  }

  public updatePost(postId: number, post: NewPost): Observable<PostResponse> {
    return this.http.patch<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`, post).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_POST_SUCCESS);
      }),
    );
  }
}
