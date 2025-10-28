import { z } from 'zod';

export const PostCommentDailyStatSchema = z.object({
  activeComments: z.number(),
  date: z.string(),
  postId: z.number(),
  totalComments: z.number(),
});

export type PostCommentDailyStatResponse = z.infer<typeof PostCommentDailyStatSchema>;
