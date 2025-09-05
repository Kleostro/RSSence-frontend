import { z } from 'zod';

import { AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';

export const POST_STATUS = {
  APPROVED: 'APPROVED',
  DRAFT: 'DRAFT',
  REJECTED: 'REJECTED',
  REVISION_REQUIRED: 'REVISION_REQUIRED',
  SUBMITTED: 'SUBMITTED',
} as const;

export type PostStatusType = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export const PostSchema = z.object({
  authors: z.array(
    z.object({
      author: AuthorSchema,
      authorId: z.number(),
      isMainAuthor: z.boolean(),
      postId: z.number(),
    }),
  ),
  content: z.string(),
  createdAt: z.string(),
  id: z.number(),
  status: z.string(),
  title: z.string(),
  updatedAt: z.string(),
});
export type PostResponse = z.infer<typeof PostSchema>;

export const PaginatedPostResponseSchema = PaginationResponseSchema(PostSchema);
export type PaginatedPostResponse = PaginationResponse<typeof PostSchema>;
