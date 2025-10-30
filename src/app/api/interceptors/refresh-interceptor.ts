import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { PART } from '@/app/api/constants/parts';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { STORE_KEYS } from '@/app/constants/store-keys';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

const PUBLIC_REQUESTS = [PART.LOGIN, PART.REGISTER];
const UNAUTHORIZED_STATUS_CODE = 401;

const isPublicRequest = (req: HttpRequest<unknown>): boolean =>
  PUBLIC_REQUESTS.some((publicReq) => req.url.includes(publicReq));

export const refreshInterceptor: HttpInterceptorFn = (request, next) => {
  const localStorageService = inject(WA_LOCAL_STORAGE);
  const authService = inject(AuthService);
  const navigationService = inject(NavigationService);

  const addAuthHeader = (req: HttpRequest<unknown>): HttpRequest<unknown> => {
    const token = String(localStorageService.getItem(STORE_KEYS.ACCESS_TOKEN));
    return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  };

  const refreshAndRetry = (): Observable<HttpEvent<unknown>> =>
    authService.refreshToken().pipe(
      switchMap(() => next(addAuthHeader(request))),
      catchError(() => {
        navigationService.navigateToLogin();
        return EMPTY;
      }),
    );

  const handleError = (error: HttpErrorResponse): Observable<HttpEvent<unknown>> => {
    if (error.status !== UNAUTHORIZED_STATUS_CODE || request.url.includes('refresh')) {
      return throwError(() => error);
    }
    return refreshAndRetry();
  };

  return isPublicRequest(request) ? next(request) : next(addAuthHeader(request)).pipe(catchError(handleError));
};
