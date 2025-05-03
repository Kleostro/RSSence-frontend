import { FormControl } from '@angular/forms';

export interface AuthorForm {
  bio: FormControl<string>;
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  username: FormControl<string>;
}
