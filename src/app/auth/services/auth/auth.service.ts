import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, Observable, take, tap } from 'rxjs';

import { ApiError } from '@/app/api/models/api-error';
import { AuthResponse } from '@/app/api/schemas/auth-response';
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
  private readonly navigationService = inject(NavigationService);
  private readonly refreshTokenService = inject(RefreshTokenService);
  private readonly tokenService = inject(TokenService);
  private readonly message = inject(MessageService);

  public isUserLoggedIn = signal(false);

  public register({ email, password }: { email: string; password: string }): Observable<AuthResponse> {
    return this.signUpService.register(email, password).pipe(
      take(1),
      tap(() => {
        this.message.showSuccessAlert(MESSAGE.REGISTRATION_SUCCESS);
      }),
      catchError((error: ApiError) => this.handleAuthError(error)),
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
    this.message.showSuccessAlert(MESSAGE.LOGIN_SUCCESS);
  }

  private handleAuthError(error: ApiError): Observable<never> {
    this.message.showErrorAlert(error.message);
    return EMPTY;
  }
}
