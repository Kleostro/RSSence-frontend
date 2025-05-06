import { z } from 'zod';

import { PostSchema } from '@/app/api/schemas/posts-response';

export const AuthorsResponseSchema = z.object({
  authoredPosts: PostSchema.array(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  coauthoredPosts: PostSchema.array(),
  firstname: z.string(),
  id: z.number(),
  lastname: z.string(),
  userId: z.number(),
  username: z.string(),
});

export type AuthorsResponse = z.infer<typeof AuthorsResponseSchema>;

export const hasKeyInAuthorsResponse = (key: string): key is keyof AuthorsResponse => {
  const keys: string[] = AuthorsResponseSchema.keyof().options;
  return keys.includes(key);
};
