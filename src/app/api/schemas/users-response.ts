import { z } from 'zod';

import { AuthorsResponseSchema } from '@/app/api/schemas/authors-response';
import { ProfilesResponseSchema } from '@/app/api/schemas/profiles-response';

export const UsersResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  roles: z.string().array(),
  profile: ProfilesResponseSchema.nullable().optional(),
  author: AuthorsResponseSchema.nullable().optional(),
});

export type UsersResponse = z.infer<typeof UsersResponseSchema>;

export const hasKeyInUsersResponse = (key: string): key is keyof UsersResponse => {
  const keys: string[] = UsersResponseSchema.keyof().options;
  return keys.includes(key);
};
