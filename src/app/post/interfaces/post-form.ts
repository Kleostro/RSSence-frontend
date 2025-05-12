import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type CoauthorsFGType = FormGroup<{ coauthor: FormControl<string> }>;

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
