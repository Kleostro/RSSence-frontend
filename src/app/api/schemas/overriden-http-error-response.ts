import { z } from 'zod';

export const OverriddenHttpErrorResponseSchema = z.object({
  error: z.object({
    statusCode: z.number(),
    path: z.string(),
    method: z.string(),
    timestamp: z.string(),
    message: z.string(),
  }),
});

export type OverriddenHttpErrorResponse = z.infer<typeof OverriddenHttpErrorResponseSchema>;
