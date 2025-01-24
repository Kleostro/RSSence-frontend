import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');
  return password && confirm && password.value === confirm.value
    ? null
    : { passwordMismatch: 'Passwords do not match' };
};
