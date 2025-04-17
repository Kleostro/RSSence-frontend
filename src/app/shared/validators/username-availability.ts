import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

import { AuthorService } from '@/app/author/services/author/author.service';
import { ProfileService } from '@/app/profile/services/profile/profile.service';

export function usernameAvailability(
  service: ProfileService | AuthorService,
  currentUsername: string | null,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> =>
    of(control.value).pipe(
      tap(() => {
        control.setErrors({ pending: true });
      }),
      switchMap((username: string) => {
        if (username === currentUsername || !username) {
          return of(null);
        }

        return service.checkUsernameAvailability(username).pipe(
          map((isAvailable: boolean | null) => {
            if (isAvailable === true) {
              return null;
            }
            return { usernameExists: true };
          }),
          catchError(() => of({ usernameExists: true })),
        );
      }),
    );
}
