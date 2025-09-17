import { z } from 'zod';

export const PaginationResponseSchema = <T extends z.ZodSchema>(
  schema: T,
): z.ZodObject<{
  first: z.ZodNumber;
  hasMore: z.ZodBoolean;
  items: z.ZodArray<T>;
  limit: z.ZodNumber;
  page: z.ZodNumber;
  total: z.ZodNumber;
  totalPages: z.ZodNumber;
}> =>
  z.object({
    first: z.number(),
    hasMore: z.boolean(),
    items: z.array(schema),
    limit: z.number(),
    page: z.number(),
    total: z.number(),
    totalPages: z.number(),
  });

export type PaginationResponse<T extends z.ZodSchema> = z.infer<ReturnType<typeof PaginationResponseSchema<T>>>;
