import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';

export type CoauthorsFGType = FormGroup<{ coauthor: FormControl<AuthorsResponse | string> }>;

export interface NewPost {
  coauthorIds: number[];
  content: null | string;
  title: string;
}

export interface PostForm {
  coauthors: FormArray<CoauthorsFGType>;
  content: FormControl<null | string>;
  title: FormControl<string>;
}
