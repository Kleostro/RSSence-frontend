import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { AuthResponse } from '@/app/api/schemas/auth-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.LOGIN}`, { email, password });
  }
}
