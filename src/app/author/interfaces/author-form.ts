import { FormControl } from '@angular/forms';

export interface AuthorForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
}
