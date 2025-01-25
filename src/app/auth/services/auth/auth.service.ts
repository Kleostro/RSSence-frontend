import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, Observable, take, tap } from 'rxjs';

import { RefreshTokenService } from '@/app/api/services/refreshToken/refresh-token.service';
import { SignUpService } from '@/app/api/services/sign-up/sign-up.service';
import { TokenService } from '@/app/api/services/token/token.service';
import { AuthResponse } from '@/app/api/types/auth-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly signUpService = inject(SignUpService);
  private readonly navigationService = inject(NavigationService);
  private readonly refreshTokenService = inject(RefreshTokenService);
  private readonly tokenService = inject(TokenService);

  public isUserLoggedIn = signal(false);

  public register({ email, password }: { email: string; password: string }): Observable<AuthResponse> {
    return this.signUpService.register(email, password).pipe(
      take(1),
      tap((data) => {
        // eslint-disable-next-line no-console
        console.log('Registration successful');
        this.handleAuthSuccess(data);
      }),
      catchError(this.handleAuthError.bind(this)),
    );
  }

  public refreshToken(): Observable<AuthResponse> {
    return this.refreshTokenService.refreshToken().pipe(
      take(1),
      tap((data) => {
        this.handleAuthSuccess(data);
      }),
      catchError(() => {
        this.isUserLoggedIn.set(false);
        this.tokenService.removeToken();
        this.navigationService.navigateToLogin();
        return EMPTY;
      }),
    );
  }

  public checkAuth(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      this.refreshToken().subscribe();
      return true;
    }
    this.isUserLoggedIn.set(false);
    return false;
  }

  private handleAuthSuccess({ accessToken }: AuthResponse): void {
    this.tokenService.setToken(accessToken);
    this.isUserLoggedIn.set(true);
  }

  private handleAuthError(_error: Error): Observable<never> {
    return EMPTY;
  }
}
