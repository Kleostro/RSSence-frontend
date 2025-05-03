import { z } from 'zod';

export const PostsResponseSchema = z.object({
  authorId: z.number(),
  coauthorsIds: z.number().array(),
  content: z.string().nullable(),
  createdAt: z.coerce.date(),
  id: z.number(),
  imageUrls: z.string().array(),
  title: z.string(),
  updatedAt: z.coerce.date(),
});

export type PostsResponse = z.infer<typeof PostsResponseSchema>;

export const hasKeyInPostsResponse = (key: string): key is keyof PostsResponse => {
  const keys: string[] = PostsResponseSchema.keyof().options;
  return keys.includes(key);
};
