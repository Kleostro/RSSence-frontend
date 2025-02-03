import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { STORE_KEYS } from '@/app/constants/store-keys';
import { ENVIRONMENT } from '@/environment/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const ls = inject(WA_LOCAL_STORAGE);
  const accessToken = ls.getItem(STORE_KEYS.ACCESS_TOKEN);

  if (!req.url.startsWith(ENVIRONMENT.API_URL)) {
    return next(req);
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

  return next(modifiedReq);
};
