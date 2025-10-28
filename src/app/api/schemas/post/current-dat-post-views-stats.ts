import { z } from 'zod';

export const CurrentDayPostViewsStatsSchema = z.object({
  totalViewsToday: z.number(),
  uniqueViewsToday: z.number(),
});
