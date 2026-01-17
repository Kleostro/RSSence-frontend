export const PART = {
  AUDIT: 'audit',
  CHILDREN: 'children',
  HISTORY: 'history',
  ID: 'id',
  LOGIN: 'login',
  LOGOUT: 'logout',
  MODERATION: 'moderation',
  MODERATOR: 'moderator',
  POST: 'post',
  POSTS: 'posts',
  REFRESH: 'refresh',
  REGISTER: 'register',
  REVERT: 'revert',
  REVIEW: 'review',
  TREND: 'trend',
  VERSION_DIFF: 'version-diff',
  VERSIONS: 'versions',
  VOTE: 'vote',
} as const;

export type Part = keyof typeof PART;
