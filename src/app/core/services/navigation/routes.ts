export const APP_PATH = {
  ADMIN: 'Admin',
  AUTHOR: 'Author',
  DEFAULT: '',
  FORBIDDEN: '403',
  HISTORY: 'History',
  LOGIN: 'Login',
  MODERATOR: 'Moderator',
  NO_MATCH: '**',
  NOT_FOUND: '404',
  POSTS: 'Posts',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  SIGN_UP: 'Sign-up',
} as const;

export const ADMIN_PATH = {
  USERS: 'Users',
} as const;

export const MODERATOR_PATH = {
  POSTS: 'Posts',
} as const;

export const APP_ROUTE = {
  ADMIN: `/${APP_PATH.ADMIN.toLowerCase()}`,
  AUTHOR: `/${APP_PATH.AUTHOR.toLowerCase()}`,
  FORBIDDEN: `/${APP_PATH.FORBIDDEN.toLowerCase()}`,
  HISTORY: `/${APP_PATH.HISTORY.toLowerCase()}`,
  HOME: '/',
  LOGIN: `/${APP_PATH.LOGIN.toLowerCase()}`,
  MODERATOR: `/${APP_PATH.MODERATOR.toLowerCase()}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
  POST_MODERATION: `/${APP_PATH.MODERATOR.toLowerCase()}/${MODERATOR_PATH.POSTS.toLowerCase()}`,
  POSTS: `/${APP_PATH.POSTS.toLowerCase()}`,
  PROFILE: `/${APP_PATH.PROFILE.toLowerCase()}`,
  SIGN_UP: `/${APP_PATH.SIGN_UP.toLowerCase()}`,
  USERS: `/${APP_PATH.ADMIN.toLowerCase()}/${ADMIN_PATH.USERS.toLowerCase()}`,
} as const;
