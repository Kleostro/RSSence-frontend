import { z } from 'zod';

export const ProfilesResponseSchema = z.object({
  firstname: z.string().nullable(),
  lastname: z.string().nullable(),
  username: z.string().nullable(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  birthdate: z.date().nullable(),
  userId: z.number(),
});

export type ProfilesResponse = z.infer<typeof ProfilesResponseSchema>;
