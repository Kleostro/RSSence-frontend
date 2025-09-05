import { z } from 'zod';

import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';

export const ProfileSchema = z.object({
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  birthdate: z.string().nullable(),
  createdAt: z.string(),
  firstname: z.string(),
  id: z.number(),
  lastname: z.string(),
  updatedAt: z.string(),
  userId: z.number(),
  username: z.string(),
});

export type ProfileResponse = z.infer<typeof ProfileSchema>;

export const PaginatedProfileResponseSchema = PaginationResponseSchema(ProfileSchema);
export type PaginatedProfileResponse = PaginationResponse<typeof ProfileSchema>;

export const hasKeyInProfileResponse = (key: string): key is keyof ProfileResponse => {
  const keys: string[] = ProfileSchema.keyof().options;
  return keys.includes(key);
};
