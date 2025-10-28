import { z } from 'zod';

export const PostViewDailyStatSchema = z.object({
  date: z.string(),
  totalViews: z.number(),
  uniqueViews: z.number(),
});

export type PostViewDailyStatResponse = z.infer<typeof PostViewDailyStatSchema>;
