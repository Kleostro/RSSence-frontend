import { z } from 'zod';

import { ProfileSchema } from '@/app/api/schemas/profiles-response';

export const ModerationHistorySchema = z.object({
  comment: z.string().nullable(),
  createdAt: z.string().nullable(),
  id: z.number(),
  moderator: z.object({
    createdAt: z.string(),
    id: z.number(),
    user: z.object({
      profile: ProfileSchema.nullable(),
    }),
    userId: z.number(),
  }),
  moderatorId: z.number().nullable(),
  newStatus: z.string(),
  previousStatus: z.string().nullable(),
  reasons: z.array(z.string()),
});

export type ModerationHistoryResponse = z.infer<typeof ModerationHistorySchema>;

export const isModerationHistoryResponse = (value: unknown): value is ModerationHistoryResponse => {
  return ModerationHistorySchema.safeParse(value).success;
};
