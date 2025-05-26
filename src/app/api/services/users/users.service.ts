import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { UserResponse } from '@/app/api/schemas/users-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  public me = signal<null | UserResponse>(null);

  public getMe(): Observable<null | UserResponse> {
    return this.http.get<null | UserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${ENDPOINTS.ME}`).pipe(
      tap((me: null | UserResponse) => {
        this.me.set(me);
      }),
    );
  }

  public getUserById(userId: number): Observable<null | UserResponse> {
    return this.http.get<null | UserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${userId.toString()}`);
  }
}
