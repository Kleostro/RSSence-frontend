import { z } from 'zod';

export const PostViewAggregationSchema = z.object({
  postId: z.number(),
  totalViews: z.number(),
  uniqueViews: z.number(),
  updatedAt: z.string(),
});
