import { z } from 'zod';

export const ApiErrorResponseSchema = z.object({
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string(),
  statusCode: z.number(),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
