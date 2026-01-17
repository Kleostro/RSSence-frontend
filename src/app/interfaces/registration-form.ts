import { FormControl } from '@angular/forms';

export interface RegistrationForm {
  confirm: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}
