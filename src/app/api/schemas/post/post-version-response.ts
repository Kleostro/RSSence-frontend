import { z } from 'zod';

import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';

export const PostVersionSchema = z.object({
  authorId: z.number(),
  coauthorsIds: z.array(z.number()),
  content: z.string(),
  createdAt: z.string(),
  id: z.number(),
  isCurrent: z.boolean(),
  postId: z.number(),
  title: z.string(),
  version: z.number(),
});

export type PaginatedPostVersionResponse = PaginationResponse<typeof PostVersionSchema>;
export const PaginatedPostVersionResponseSchema = PaginationResponseSchema(PostVersionSchema);
export type PostVersionResponse = z.infer<typeof PostVersionSchema>;

export const isPostVersionResponse = (value: unknown): value is PostVersionResponse => {
  return PostVersionSchema.safeParse(value).success;
};
