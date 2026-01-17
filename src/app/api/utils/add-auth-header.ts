import { HttpRequest } from '@angular/common/http';

export const addAuthHeader = (req: HttpRequest<unknown>, token: null | string): HttpRequest<unknown> => {
  if (!token) {
    return req.clone({ withCredentials: true });
  }

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};
