export const PART = {
  AUDIT: 'audit',
  CHILDREN: 'children',
  CHILDREN_COUNT: 'children-count',
  FULL_HISTORY: 'full-history',
  ID: 'id',
  MODERATION: 'moderation',
  MODERATOR: 'moderator',
  POST: 'post',
  POSTS: 'posts',
  REVERT: 'revert',
  TREND: 'trend',
  VERSION_DIFF: 'version-diff',
  VERSIONS: 'versions',
  VOTE: 'vote',
} as const;

export type Part = keyof typeof PART;
