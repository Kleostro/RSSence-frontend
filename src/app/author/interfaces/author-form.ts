import { FormControl } from '@angular/forms';

export interface AuthorForm {
  username: FormControl<string>;
  bio: FormControl<string>;
}
