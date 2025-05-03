import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PostsResponse } from '@/app/api/schemas/posts-response';
import { NewPost } from '@/app/post/interfaces/post-form';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  public createPost(post: NewPost): Observable<PostsResponse> {
    return this.http.post<PostsResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, post);
  }

  public deletePost(postId: number): Observable<PostsResponse> {
    return this.http.delete<PostsResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`);
  }

  public getAllPosts(): Observable<PostsResponse[]> {
    return this.http.get<PostsResponse[]>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`);
  }

  public getPostById(postId: number): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/${postId.toString()}`);
  }

  public getPostsByAuthorId(authorId: number): Observable<PostsResponse[]> {
    return this.http.get<PostsResponse[]>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}/author/${authorId.toString()}`);
  }

  public updatePost(post: FormData): Observable<PostsResponse> {
    return this.http.patch<PostsResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.POSTS}`, post);
  }
}
