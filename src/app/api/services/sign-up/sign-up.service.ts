import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private readonly http = inject(HttpClient);

  public register(email: string, password: string): Observable<unknown> {
    return this.http
      .post<unknown>(`${ENVIRONMENT.API_URL}auth/register`, { email, password })
      .pipe(catchError(() => throwError(() => new Error('Failed to register. Please try again later.'))));
  }
}
