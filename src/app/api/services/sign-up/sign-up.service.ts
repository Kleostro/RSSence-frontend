import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private readonly http = inject(HttpClient);

  public register(email: string, password: string): Observable<unknown> {
    return this.http.post<unknown>(`${ENVIRONMENT.API_URL}${ENDPOINTS.SIGN_UP}`, { email, password });
  }
}
