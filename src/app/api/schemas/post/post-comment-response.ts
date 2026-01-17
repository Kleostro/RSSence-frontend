import { z } from 'zod';

import { PaginationResponse, PaginationResponseSchema } from '@/app/api/schemas/pagination-response';
import { ProfileResponse, ProfileSchema } from '@/app/api/schemas/profiles-response';

export const PostCommentVoteType = {
  DISLIKE: 'DISLIKE',
  LIKE: 'LIKE',
  NEUTRAL: 'NEUTRAL',
} as const;

export interface PostComment {
  children: PostComment[];
  childrenCount: number;
  commentVotes: PostCommentVote[];
  content: string;
  createdAt: string;
  dislikes: number;
  id: number;
  isDeleted: boolean;
  likes: number;
  parentId: null | number;
  postId: number;
  profile: null | ProfileResponse;
  profileId: null | number;
  updatedAt: string;
}

export interface PostCommentVote {
  commentId: number;
  id: number;
  userId: number;
  voteType: PostCommentVoteType;
}

export type PostCommentVoteType = (typeof PostCommentVoteType)[keyof typeof PostCommentVoteType];

export const PostCommentSchema: z.ZodType<PostComment> = z.object({
  children: z.array(z.lazy(() => PostCommentSchema)),
  childrenCount: z.number(),
  commentVotes: z.array(
    z.object({
      commentId: z.number(),
      id: z.number(),
      userId: z.number(),
      voteType: z.enum([PostCommentVoteType.LIKE, PostCommentVoteType.DISLIKE, PostCommentVoteType.NEUTRAL]),
    }),
  ),
  content: z.string(),
  createdAt: z.string(),
  dislikes: z.number(),
  id: z.number(),
  isDeleted: z.boolean(),
  likes: z.number(),
  parentId: z.number().nullable(),
  postId: z.number(),
  profile: ProfileSchema.nullable(),
  profileId: z.number().nullable(),
  updatedAt: z.string(),
});

export type PostCommentResponse = z.infer<typeof PostCommentSchema>;

export const PaginatedPostCommentResponseSchema = PaginationResponseSchema(PostCommentSchema);
export type PaginatedPostCommentResponse = PaginationResponse<typeof PostCommentSchema>;

export const isPostCommentResponse = (value: unknown): value is PostCommentResponse => {
  return PostCommentSchema.safeParse(value).success;
};
