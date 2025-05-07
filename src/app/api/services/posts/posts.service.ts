/* eslint-disable @typescript-eslint/no-misused-spread */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedPostResponse, PostResponse } from '@/app/api/schemas/posts-response';
import { NewPost } from '@/app/post/interfaces/post-form';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  public createPost(post: NewPost): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, post);
  }

  public deletePost(postId: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`);
  }

  public getAllPosts(authorId?: number, query?: PaginationQueryDto): Observable<PaginatedPostResponse> {
    return this.http.get<PaginatedPostResponse>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}${authorId ? `/${authorId}` : ''}`,
      {
        params: { ...query },
      },
    );
  }

  public getPostById(postId: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`);
  }

  public updatePost(post: FormData): Observable<PostResponse> {
    return this.http.patch<PostResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, post);
  }
}
