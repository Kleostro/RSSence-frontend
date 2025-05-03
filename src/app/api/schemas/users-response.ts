import { z } from 'zod';

import { AuthorsResponseSchema } from '@/app/api/schemas/authors-response';
import { ProfilesResponseSchema } from '@/app/api/schemas/profiles-response';

export const UsersResponseSchema = z.object({
  author: AuthorsResponseSchema.nullable().optional(),
  createdAt: z.coerce.date(),
  email: z.string(),
  id: z.number(),
  profile: ProfilesResponseSchema.nullable().optional(),
  roles: z.string().array(),
  updatedAt: z.coerce.date(),
});

export type UsersResponse = z.infer<typeof UsersResponseSchema>;

export const hasKeyInUsersResponse = (key: string): key is keyof UsersResponse => {
  const keys: string[] = UsersResponseSchema.keyof().options;
  return keys.includes(key);
};
