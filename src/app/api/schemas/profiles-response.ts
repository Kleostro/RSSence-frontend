import { z } from 'zod';

export const ProfilesResponseSchema = z.object({
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  birthdate: z.string().nullable(),
  firstname: z.string(),
  lastname: z.string(),
  userId: z.number(),
  username: z.string(),
});

export type ProfilesResponse = z.infer<typeof ProfilesResponseSchema>;

export const hasKeyInProfilesResponse = (key: string): key is keyof ProfilesResponse => {
  const keys: string[] = ProfilesResponseSchema.keyof().options;
  return keys.includes(key);
};
