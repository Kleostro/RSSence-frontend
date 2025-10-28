import { z } from 'zod';

export const PostVersionDiffSchema = z.object({
  coauthors: z.object({
    diff: z.object({
      left: z.array(
        z.object({
          parts: z.array(
            z.object({
              type: z.enum(['add', 'remove', 'common']),
              value: z.string(),
            }),
          ),
          type: z.enum(['add', 'remove', 'common']),
        }),
      ),
      right: z.array(
        z.object({
          parts: z.array(
            z.object({
              type: z.enum(['add', 'remove', 'common']),
              value: z.string(),
            }),
          ),
          type: z.enum(['add', 'remove', 'common']),
        }),
      ),
    }),
    new: z.string(),
    old: z.string(),
  }),
  content: z.object({
    diff: z.object({
      left: z.array(
        z.object({
          parts: z.array(
            z.object({
              type: z.enum(['add', 'remove', 'common']),
              value: z.string(),
            }),
          ),
          type: z.enum(['add', 'remove', 'common']),
        }),
      ),
      right: z.array(
        z.object({
          parts: z.array(
            z.object({
              type: z.enum(['add', 'remove', 'common']),
              value: z.string(),
            }),
          ),
          type: z.enum(['add', 'remove', 'common']),
        }),
      ),
    }),
    new: z.string(),
    old: z.string(),
  }),
  createdAtFrom: z.string(),
  createdAtTo: z.string(),
  title: z.object({
    diff: z.object({
      left: z.array(
        z.object({
          parts: z.array(
            z.object({
              type: z.enum(['add', 'remove', 'common']),
              value: z.string(),
            }),
          ),
          type: z.enum(['add', 'remove', 'common']),
        }),
      ),
      right: z.array(
        z.object({
          parts: z.array(
            z.object({
              type: z.enum(['add', 'remove', 'common']),
              value: z.string(),
            }),
          ),
          type: z.enum(['add', 'remove', 'common']),
        }),
      ),
    }),
    new: z.string(),
    old: z.string(),
  }),
  versionFrom: z.number(),
  versionTo: z.number(),
});

export type PostVersionDiffResponse = z.infer<typeof PostVersionDiffSchema>;

export const isPostVersionDiffResponse = (value: unknown): value is PostVersionDiffResponse => {
  return PostVersionDiffSchema.safeParse(value).success;
};
