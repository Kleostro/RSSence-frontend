import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private readonly http = inject(HttpClient);

  public getProfiles(): Observable<ProfilesResponse[]> {
    return this.http.get<ProfilesResponse[]>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`);
  }

  public createProfile(profile: FormData): Observable<ProfilesResponse> {
    return this.http.post<ProfilesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`, profile);
  }

  public updateProfile(profile: FormData): Observable<ProfilesResponse> {
    return this.http.patch<ProfilesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`, profile);
  }

  public deleteProfile(): Observable<ProfilesResponse> {
    return this.http.delete<ProfilesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`);
  }

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${ENDPOINTS.USERNAME_CHECK}`, {
      username,
    });
  }
}
