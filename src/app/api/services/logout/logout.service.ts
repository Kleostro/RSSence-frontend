import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PART } from '@/app/api/constants/parts';
import { LogoutResponse } from '@/app/api/schemas/logout-response';
import { buildApiUrl } from '@/app/api/utils/build-api-url';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private readonly http = inject(HttpClient);

  public logout(): Observable<LogoutResponse> {
    const url = buildApiUrl(ENDPOINTS.AUTH, PART.LOGOUT);
    return this.http.post<LogoutResponse>(url, null);
  }
}
