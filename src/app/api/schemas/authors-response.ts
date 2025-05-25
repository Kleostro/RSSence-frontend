import { z } from 'zod';

import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';

export const AuthorSchema = z.object({
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: z.string(),
  firstname: z.string(),
  id: z.number(),
  lastname: z.string(),
  profileUsername: z.string().nullable(),
  updatedAt: z.string(),
  username: z.string(),
});
export type AuthorResponse = z.infer<typeof AuthorSchema>;

export const PaginatedAuthorResponseSchema = PaginationResponseSchema(AuthorSchema);
export type PaginatedAuthorResponse = PaginationResponse<z.infer<typeof AuthorSchema>>;

export const hasKeyInAuthorResponse = (key: string): key is keyof AuthorResponse => {
  const keys: string[] = AuthorSchema.keyof().options;
  return keys.includes(key);
};
