import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { catchError, finalize, throwError } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { STORE_KEYS } from '@/app/constants/store-keys';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { ENVIRONMENT } from '@/environment/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
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

  let modifiedReq = req.clone({
    withCredentials: true,
  });

  if (accessToken) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(modifiedReq).pipe(
    finalize(() => {
      loaderService.turnOff();
    }),
    catchError((error: OverriddenHttpErrorResponse) => throwError(() => error)),
  );
};
