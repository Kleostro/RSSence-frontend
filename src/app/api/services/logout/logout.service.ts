import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { LogoutResponse } from '@/app/api/schemas/logout-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private readonly http = inject(HttpClient);

  public logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.LOGOUT}`, null);
  }
}
