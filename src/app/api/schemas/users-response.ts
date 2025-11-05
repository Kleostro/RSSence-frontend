import { z } from 'zod';

import { AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';
import { ProfileSchema } from '@/app/api/schemas/profiles-response';
import { UserRoleSchema } from '@/app/api/schemas/roles-response';

export const UserSchema = z.object({
  author: AuthorSchema.nullable().optional(),
  createdAt: z.string(),
  email: z.string(),
  id: z.number(),
  profile: ProfileSchema.nullable().optional(),
  roles: UserRoleSchema.array(),
  updatedAt: z.string(),
});

export type UserResponse = z.infer<typeof UserSchema>;

export const PaginatedUserResponseSchema = PaginationResponseSchema(UserSchema);
export type PaginatedUserResponse = PaginationResponse<typeof UserSchema>;

export const hasKeyInUserResponse = (key: string): key is keyof UserResponse => {
  const keys: string[] = UserSchema.keyof().options;
  return keys.includes(key);
};
