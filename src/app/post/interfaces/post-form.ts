import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';

export type CoauthorsFGType = FormGroup<{ coauthor: FormControl<AuthorsResponse | string> }>;
export type ImageUrlsFGType = FormGroup<{ imageUrl: FormControl<string> }>;

export interface NewPost {
  coauthorIds: number[];
  content: null | string;
  imageUrls: string[];
  title: string;
}

export interface PostForm {
  coauthors: FormArray<CoauthorsFGType>;
  content: FormControl<null | string>;
  imageUrls: FormArray<ImageUrlsFGType>;
  title: FormControl<string>;
}
