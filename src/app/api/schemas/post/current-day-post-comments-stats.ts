import { z } from 'zod';

export const CurrentDayPostCommentsStatsSchema = z.object({
  activeCommentsToday: z.number(),
  totalCommentsToday: z.number(),
});
