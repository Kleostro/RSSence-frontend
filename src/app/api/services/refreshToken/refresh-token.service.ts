import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { AuthResponse } from '@/app/api/types/auth-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  private readonly http = inject(HttpClient);

  public refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.REFRESH}`);
  }
}
