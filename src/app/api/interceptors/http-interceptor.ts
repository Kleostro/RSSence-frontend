import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { catchError, finalize, throwError } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { addAuthHeader } from '@/app/api/utils/add-auth-header';
import { STORE_KEYS } from '@/app/constants/store-keys';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ENVIRONMENT } from '@/environment/environment';

const FORBIDDEN_STATUS_CODE = 403;

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const navigationService = inject(NavigationService);
  const ls = inject(WA_LOCAL_STORAGE);
  const accessToken = ls.getItem(STORE_KEYS.ACCESS_TOKEN);

  loaderService.turnOn();

  if (!req.url.startsWith(ENVIRONMENT.API_URL)) {
    return next(req).pipe(
      finalize(() => {
        loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error)),
    );
  }

  const modifiedReq = addAuthHeader(req, accessToken);

  return next(modifiedReq).pipe(
    finalize(() => {
      loaderService.turnOff();
    }),
    catchError((error: OverriddenHttpErrorResponse) => {
      if (error.error.statusCode === FORBIDDEN_STATUS_CODE) {
        navigationService.navigateToForbidden();
      }
      return throwError(() => error);
    }),
  );
};
