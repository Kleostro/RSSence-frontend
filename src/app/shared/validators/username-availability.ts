import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

import { debounceTime, first, map, switchMap, tap } from 'rxjs';

import { AuthorService } from '@/app/author/services/author/author.service';
import { ProfileService } from '@/app/profile/services/profile/profile.service';
import { FIELD_ERROR_KEY } from '@/app/shared/constants/field-error-key';

export function usernameAvailability(
  service: ProfileService | AuthorService,
  currentUsername: string | null,
): AsyncValidatorFn {
  const DEBOUNCE_TIME = 400;
  return (control: AbstractControl) =>
    control.valueChanges.pipe(
      debounceTime(DEBOUNCE_TIME),
      tap(() => {
        const value = String(control.value);
        return value === currentUsername || !control.value ? null : value;
      }),
      switchMap((value: string) => service.checkUsernameAvailability(value)),
      map((unique: boolean | null) => (unique ? null : { [FIELD_ERROR_KEY.USERNAME_EXISTS]: true })),
      first(),
    );
}
