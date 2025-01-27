import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiError } from '@/app/api/models/api-error';
import { ApiErrorResponseSchema } from '@/app/api/schemas/api-error-response';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const parsed = ApiErrorResponseSchema.safeParse(error.error);

      const apiError = parsed.success
        ? new ApiError(parsed.data.message, parsed.data.error, error.status || 500)
        : new ApiError('Unknown error', 'Unknown error type', error.status || 500);

      return throwError(() => apiError);
    }),
  );
