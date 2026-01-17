import { catchError, EMPTY, Observable } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { MessageService } from '@/app/shared/services/message/message.service';

export const handleHttpError = <T>(
  messageService: MessageService,
  defaultMessage = 'Something went wrong',
): ((source: Observable<T>) => Observable<T>) => {
  return (source: Observable<T>) =>
    source.pipe(
      catchError((error: OverriddenHttpErrorResponse) => {
        const errorMessage = error.error.message || defaultMessage;
        messageService.error(errorMessage);
        return EMPTY;
      }),
    );
};
