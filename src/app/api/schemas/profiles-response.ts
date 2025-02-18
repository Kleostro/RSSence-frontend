import { z } from 'zod';

export const ProfilesResponseSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  birthdate: z.string().nullable(),
  userId: z.number(),
});

export type ProfilesResponse = z.infer<typeof ProfilesResponseSchema>;

export const hasKeyInProfilesResponse = (key: string): key is keyof ProfilesResponse => {
  const keys: string[] = ProfilesResponseSchema.keyof().options;
  return keys.includes(key);
};
