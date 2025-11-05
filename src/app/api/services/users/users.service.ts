import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { PaginatedUserResponse, PaginatedUserResponseSchema, UserResponse } from '@/app/api/schemas/users-response';
import { ROLE } from '@/app/constants/roles';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  public readonly isModerator = signal<boolean>(false);
  public me = signal<null | UserResponse>(null);

  public deleteUser(userId: number): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${userId.toString()}`);
  }

  public getAllUsers(query?: PaginationQueryDto): Observable<null | PaginatedUserResponse> {
    return this.http
      .get<PaginatedUserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}`, {
        params: { ...query },
      })
      .pipe(
        map((response) => {
          const { data, success } = PaginatedUserResponseSchema.safeParse(response);
          return success ? data : null;
        }),
      );
  }

  public getMe(): Observable<null | UserResponse> {
    return this.http.get<null | UserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${ENDPOINTS.ME}`).pipe(
      tap((me) => {
        this.me.set(me);
        const moderatorRole = me?.roles.find((role) => role.role.name === ROLE.MODERATOR);
        this.isModerator.set(!!moderatorRole);
      }),
    );
  }

  public getUserById(userId: number): Observable<null | UserResponse> {
    return this.http.get<null | UserResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${userId.toString()}`);
  }
}
