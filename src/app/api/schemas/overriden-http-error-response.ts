import { z } from 'zod';

export const OverriddenHttpErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    method: z.string(),
    path: z.string(),
    statusCode: z.number(),
    timestamp: z.string(),
  }),
});

export type OverriddenHttpErrorResponse = z.infer<typeof OverriddenHttpErrorResponseSchema>;
