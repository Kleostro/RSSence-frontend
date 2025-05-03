import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private readonly http = inject(HttpClient);

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}/${ENDPOINTS.USERNAME_CHECK}`, {
      username,
    });
  }

  public createAuthor(author: FormData): Observable<AuthorsResponse> {
    return this.http.post<AuthorsResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`, author);
  }

  public deleteAuthor(): Observable<AuthorsResponse> {
    return this.http.delete<AuthorsResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`);
  }

  public getAuthors(): Observable<AuthorsResponse[]> {
    return this.http.get<AuthorsResponse[]>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`);
  }

  public updateAuthor(author: FormData): Observable<AuthorsResponse> {
    return this.http.patch<AuthorsResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.AUTHORS}`, author);
  }
}
