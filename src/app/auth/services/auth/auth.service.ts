import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';

import { AuthResponse } from '@/app/api/schemas/auth-response';
import { LogoutResponse } from '@/app/api/schemas/logout-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { LoginService } from '@/app/api/services/login/login.service';
import { LogoutService } from '@/app/api/services/logout/logout.service';
import { RefreshTokenService } from '@/app/api/services/refresh-token/refresh-token.service';
import { SignUpService } from '@/app/api/services/sign-up/sign-up.service';
import { TokenService } from '@/app/api/services/token/token.service';
import { UserService } from '@/app/auth/services/user/user.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginService = inject(LoginService);
  private readonly logoutService = inject(LogoutService);
  private readonly message = inject(MessageService);
  private readonly navigationService = inject(NavigationService);
  private readonly refreshTokenService = inject(RefreshTokenService);
  private readonly signUpService = inject(SignUpService);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);

  public isUserLoggedIn = signal(false);

  private handleAuthError(error: OverriddenHttpErrorResponse): Observable<never> {
    this.message.error(error.error.message);
    return EMPTY;
  }

  private handleAuthSuccess({ accessToken, refreshToken }: AuthResponse): void {
    this.tokenService.setToken(accessToken, refreshToken);
    this.isUserLoggedIn.set(true);
    this.message.success(MESSAGE.LOGIN_SUCCESS);
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

  public login({ email, password }: { email: string; password: string }): Observable<AuthResponse> {
    return this.loginService.login(email, password).pipe(
      tap((data) => {
        this.handleAuthSuccess(data);
        this.navigationService.navigateToHome();
      }),
      catchError(this.handleAuthError.bind(this)),
    );
  }

  public logout(): Observable<LogoutResponse> {
    return this.logoutService.logout().pipe(
      tap(() => {
        this.isUserLoggedIn.set(false);
        this.userService.me.set(null);
        this.tokenService.removeToken();
        this.navigationService.navigateToLogin();
        this.message.success(MESSAGE.LOGOUT_SUCCESS);
      }),
      catchError(() => {
        this.message.error(MESSAGE.LOGOUT_ERROR);
        return EMPTY;
      }),
    );
  }

  public refreshToken(): Observable<AuthResponse> {
    return this.refreshTokenService.refreshToken().pipe(
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

  public register({ email, password }: { email: string; password: string }): Observable<AuthResponse> {
    return this.signUpService.register(email, password).pipe(
      tap(() => {
        this.message.success(MESSAGE.REGISTRATION_SUCCESS);
      }),
      switchMap(() => this.login({ email, password })),
      catchError((error: OverriddenHttpErrorResponse) => this.handleAuthError(error)),
    );
  }
}
