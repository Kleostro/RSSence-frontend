import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { UsersResponse } from '@/app/api/schemas/users-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  public getMe(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${ENDPOINTS.ME}`);
  }

  public getUserById(userId: number): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${userId.toString()}`);
  }
}
