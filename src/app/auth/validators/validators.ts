import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): null | ValidationErrors => {
  const password = control.get('password');
  const confirm = control.get('confirm');

  if (!password || !confirm) {
    return null;
  }

  if (password.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
  } else {
    const errors = confirm.errors;
    if (errors?.['passwordMismatch']) {
      delete errors['passwordMismatch'];
      confirm.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  return null;
};
