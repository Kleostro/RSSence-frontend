import { FormControl } from '@angular/forms';

export interface ProfileForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
}
