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

  public createProfile(profile: FormData): Observable<ProfilesResponse> {
    return this.http.post<ProfilesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}`, profile);
  }

  public getMe(): Observable<ProfilesResponse | null> {
    return this.http.get<ProfilesResponse | null>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${ENDPOINTS.ME}`);
  }

  public updateProfileMe(profile: FormData): Observable<ProfilesResponse> {
    return this.http.patch<ProfilesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${ENDPOINTS.ME}`, profile);
  }

  public deleteProfileMe(): Observable<ProfilesResponse> {
    return this.http.delete<ProfilesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.PROFILES}/${ENDPOINTS.ME}`);
  }
}
