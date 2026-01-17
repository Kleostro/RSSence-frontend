import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { PART } from '@/app/api/constants/parts';
import { addAuthHeader } from '@/app/api/utils/add-auth-header';
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

  const token = localStorageService.getItem(STORE_KEYS.ACCESS_TOKEN);
  const addAuthHeaderToRequest = (req: HttpRequest<unknown>): HttpRequest<unknown> => addAuthHeader(req, token);

  const refreshAndRetry = (): Observable<HttpEvent<unknown>> =>
    authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = localStorageService.getItem(STORE_KEYS.ACCESS_TOKEN);
        return next(addAuthHeader(request, newToken));
      }),
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

  return isPublicRequest(request) ? next(request) : next(addAuthHeaderToRequest(request)).pipe(catchError(handleError));
};
