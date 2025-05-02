import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';

export type ImageUrlsFGType = FormGroup<{ imageUrl: FormControl<string> }>;
export type CoauthorsFGType = FormGroup<{ coauthor: FormControl<string | AuthorsResponse> }>;

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string | null>;
  imageUrls: FormArray<ImageUrlsFGType>;
  coauthors: FormArray<CoauthorsFGType>;
}

export interface NewPost {
  title: string;
  content: string | null;
  imageUrls: string[];
  coauthorIds: number[];
}
