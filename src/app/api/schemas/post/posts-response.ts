import { z } from 'zod';

import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';
import { CurrentDayPostViewsStatsSchema } from '@/app/api/schemas/post/current-dat-post-views-stats';
import { CurrentDayPostCommentsStatsSchema } from '@/app/api/schemas/post/current-day-post-comments-stats';
import { PostAuthorSchema } from '@/app/api/schemas/post/post-author';
import { PostCommentAggregationSchema } from '@/app/api/schemas/post/post-comment-aggregation';
import { PostCommentSchema } from '@/app/api/schemas/post/post-comment-response';
import { PostViewAggregationSchema } from '@/app/api/schemas/post/post-view-aggregation';

export const POST_STATUS = {
  APPROVED: 'APPROVED',
  DRAFT: 'DRAFT',
  REJECTED: 'REJECTED',
  REVISION_REQUIRED: 'REVISION_REQUIRED',
  SUBMITTED: 'SUBMITTED',
} as const;

export type PostStatusType = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export const PostSchema = z.object({
  authors: z.array(PostAuthorSchema),
  commentAggregation: PostCommentAggregationSchema.nullable(),
  comments: z.array(PostCommentSchema).optional(),
  content: z.string(),
  createdAt: z.string(),
  currentDayCommentsStats: CurrentDayPostCommentsStatsSchema.nullable().optional(),
  currentDayViewStats: CurrentDayPostViewsStatsSchema.nullable().optional(),
  id: z.number(),
  postViewAggregation: PostViewAggregationSchema.nullable(),
  slug: z.string().optional().nullable(),
  status: z.string(),
  title: z.string(),
  updatedAt: z.string(),
});

export type PostResponse = z.infer<typeof PostSchema>;

export const PaginatedPostResponseSchema = PaginationResponseSchema(PostSchema);
export type PaginatedPostResponse = PaginationResponse<typeof PostSchema>;
