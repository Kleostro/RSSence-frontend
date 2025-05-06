import { z } from 'zod';

export const PaginationResponseSchema = <T extends z.ZodTypeAny>(
  schema: T,
): z.ZodObject<{
  hasMore: z.ZodBoolean;
  items: z.ZodArray<T>;
  limit: z.ZodNumber;
  page: z.ZodNumber;
  total: z.ZodNumber;
  totalPages: z.ZodNumber;
}> =>
  z.object({
    hasMore: z.boolean(),
    items: schema.array(),
    limit: z.number(),
    page: z.number(),
    total: z.number(),
    totalPages: z.number(),
  });

export type PaginationResponse<T> = z.infer<
  ReturnType<typeof PaginationResponseSchema<T extends z.ZodTypeAny ? T : z.ZodTypeAny>>
>;
