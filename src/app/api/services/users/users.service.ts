import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { UserResponse } from '@/app/api/schemas/users-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  public getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${ENDPOINTS.ME}`);
  }

  public getUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${userId.toString()}`);
  }
}
