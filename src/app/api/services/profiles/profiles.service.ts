import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import {
  PaginatedProfileResponse,
  PaginatedProfileResponseSchema,
  ProfileResponse,
} from '@/app/api/schemas/profiles-response';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private readonly http = inject(HttpClient);
  private readonly message = inject(MessageService);

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${ENDPOINTS.USERNAME_CHECK}`, {
      username,
    });
  }

  public createProfile(profile: FormData): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`, profile).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_PROFILE_SUCCESS);
      }),
    );
  }

  public deleteProfile(username: string): Observable<ProfileResponse> {
    return this.http.delete<ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${username}`).pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_PROFILE_SUCCESS);
      }),
    );
  }

  public getProfileByUsername(username: string): Observable<null | ProfileResponse> {
    return this.http.get<null | ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${username}`);
  }

  public getProfiles(): Observable<null | PaginatedProfileResponse> {
    return this.http.get<PaginatedProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`).pipe(
      map((response: PaginatedProfileResponse) => {
        const { data, success } = PaginatedProfileResponseSchema.safeParse(response);
        return success ? data : null;
      }),
    );
  }

  public updateProfile(profile: FormData): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`, profile).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_PROFILE_SUCCESS);
      }),
    );
  }
}
