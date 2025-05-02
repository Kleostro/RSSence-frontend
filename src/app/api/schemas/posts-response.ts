import { z } from 'zod';

export const PostsResponseSchema = z.object({
  id: z.number(),
  authorId: z.number(),
  title: z.string(),
  content: z.string().nullable(),
  imageUrls: z.string().array(),
  coauthorsIds: z.number().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PostsResponse = z.infer<typeof PostsResponseSchema>;

export const hasKeyInPostsResponse = (key: string): key is keyof PostsResponse => {
  const keys: string[] = PostsResponseSchema.keyof().options;
  return keys.includes(key);
};
