import { z } from 'zod';

export const ImagesResponseSchema = z.object({
  url: z.string(),
});

export type ImagesResponse = z.infer<typeof ImagesResponseSchema>;
