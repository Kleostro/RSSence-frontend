import { z } from 'zod';

export const AuthorsResponseSchema = z.object({
  username: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  userId: z.number(),
});

export type AuthorsResponse = z.infer<typeof AuthorsResponseSchema>;

export const hasKeyInAuthorsResponse = (key: string): key is keyof AuthorsResponse => {
  const keys: string[] = AuthorsResponseSchema.keyof().options;
  return keys.includes(key);
};
