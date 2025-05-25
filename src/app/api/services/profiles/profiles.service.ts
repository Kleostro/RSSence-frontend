import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { ProfileResponse } from '@/app/api/schemas/profiles-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private readonly http = inject(HttpClient);

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${ENDPOINTS.USERNAME_CHECK}`, {
      username,
    });
  }

  public createProfile(profile: FormData): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`, profile);
  }

  public deleteProfile(): Observable<ProfileResponse> {
    return this.http.delete<ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`);
  }

  public getProfileByUsername(username: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${username}`);
  }

  public getProfiles(): Observable<ProfileResponse[]> {
    return this.http.get<ProfileResponse[]>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`);
  }

  public updateProfile(profile: FormData): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`, profile);
  }
}
