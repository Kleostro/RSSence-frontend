import { z } from 'zod';

import { AuthorSchema } from '@/app/api/schemas/authors-response';

export const PostHistorySchema = z.object({
  actionType: z.string(),
  author: AuthorSchema,
  authorUsername: z.string(),
  createdAt: z.string(),
  description: z.string().nullable(),
  id: z.number(),
  postId: z.number(),
});

export type PostHistoryResponse = z.infer<typeof PostHistorySchema>;

export const isPostHistoryResponse = (value: unknown): value is PostHistoryResponse => {
  return PostHistorySchema.safeParse(value).success;
};
