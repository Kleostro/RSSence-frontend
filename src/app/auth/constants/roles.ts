export const ROLE = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  SUPER_ADMIN: 'SUPER_ADMIN',
  USER: 'USER',
} as const;

export type RoleType = (typeof ROLE)[keyof typeof ROLE];
