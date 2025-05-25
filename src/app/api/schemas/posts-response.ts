import { z } from 'zod';

import { AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';

export const PostSchema = z.object({
  authors: z.array(
    z.object({
      author: AuthorSchema,
      authorUsername: z.string(),
      isMainAuthor: z.boolean(),
      postId: z.number(),
    }),
  ),
  content: z.string(),
  createdAt: z.string(),
  id: z.number(),
  title: z.string(),
  updatedAt: z.string(),
});
export type PostResponse = z.infer<typeof PostSchema>;

export const PaginatedPostResponseSchema = PaginationResponseSchema(PostSchema);
export type PaginatedPostResponse = PaginationResponse<z.infer<typeof PostSchema>>;
