import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AuthorResponse } from '@/app/api/schemas/authors-response';

export type CoauthorsFGType = FormGroup<{ coauthor: FormControl<AuthorResponse | null> }>;

export interface NewPost {
  coauthorIds: number[];
  content: string;
  title: string;
}

export interface PostForm {
  coauthors: FormArray<CoauthorsFGType>;
  content: FormControl<string>;
  title: FormControl<string>;
}
