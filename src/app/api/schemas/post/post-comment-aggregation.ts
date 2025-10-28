import { z } from 'zod';

export const PostCommentAggregationSchema = z.object({
  activeComments: z.number(),
  postId: z.number(),
  totalComments: z.number(),
  updatedAt: z.string(),
});
