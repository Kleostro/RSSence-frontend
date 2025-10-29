import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PART } from '@/app/api/constants/parts';
import { AuthResponse } from '@/app/api/schemas/auth-response';
import { buildApiUrl } from '@/app/api/utils/build-api-url';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  private readonly http = inject(HttpClient);

  public refreshToken(): Observable<AuthResponse> {
    const url = buildApiUrl(ENDPOINTS.AUTH, PART.REFRESH);
    return this.http.post<AuthResponse>(url, null);
  }
}
