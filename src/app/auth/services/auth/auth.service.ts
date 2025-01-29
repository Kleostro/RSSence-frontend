import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, Observable, take, tap } from 'rxjs';

import { ApiError } from '@/app/api/models/api-error';
import { AuthResponse } from '@/app/api/schemas/auth-response';
import { LoginService } from '@/app/api/services/login/login.service';
import { RefreshTokenService } from '@/app/api/services/refresh-token/refresh-token.service';
import { SignUpService } from '@/app/api/services/sign-up/sign-up.service';
import { TokenService } from '@/app/api/services/token/token.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly signUpService = inject(SignUpService);
  private readonly loginService = inject(LoginService);
  private readonly navigationService = inject(NavigationService);
  private readonly refreshTokenService = inject(RefreshTokenService);
  private readonly tokenService = inject(TokenService);
  private readonly message = inject(MessageService);

  public isUserLoggedIn = signal(false);

  public register({ email, password }: { email: string; password: string }): Observable<AuthResponse> {
    return this.signUpService.register(email, password).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.REGISTRATION_SUCCESS);
      }),
      catchError((error: ApiError) => this.handleAuthError(error)),
    );
  }

  public login({ email, password }: { email: string; password: string }): Observable<AuthResponse> {
    return this.loginService.login(email, password).pipe(
      take(1),
      tap((data) => {
        this.handleAuthSuccess(data);
        this.navigationService.navigateToHome();
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
    this.message.success(MESSAGE.LOGIN_SUCCESS);
  }

  private handleAuthError(error: ApiError): Observable<never> {
    this.message.error(error.message);
    return EMPTY;
  }
}
