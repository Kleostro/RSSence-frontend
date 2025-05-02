import { z } from 'zod';

import { PostsResponseSchema } from '@/app/api/schemas/posts-response';

export const AuthorsResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  authoredPosts: PostsResponseSchema.array(),
  coauthoredPosts: PostsResponseSchema.array(),
});

export type AuthorsResponse = z.infer<typeof AuthorsResponseSchema>;

export const hasKeyInAuthorsResponse = (key: string): key is keyof AuthorsResponse => {
  const keys: string[] = AuthorsResponseSchema.keyof().options;
  return keys.includes(key);
};
