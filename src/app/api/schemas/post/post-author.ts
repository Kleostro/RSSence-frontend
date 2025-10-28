import { z } from 'zod';

import { AuthorSchema } from '@/app/api/schemas/authors-response';

export const PostAuthorSchema = z.object({
  author: AuthorSchema,
  authorId: z.number(),
  isMainAuthor: z.boolean(),
  postId: z.number(),
});
