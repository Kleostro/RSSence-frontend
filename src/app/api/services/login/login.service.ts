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
export class LoginService {
  private readonly http = inject(HttpClient);

  public login(email: string, password: string): Observable<AuthResponse> {
    const url = buildApiUrl(ENDPOINTS.AUTH, PART.LOGIN);
    return this.http.post<AuthResponse>(url, { email, password });
  }
}
