export const APP_PATH = {
  ADMIN: 'Admin',
  ANALYTICS: 'Analytics',
  AUTHOR: 'Author',
  CREATION: 'Creation',
  DEFAULT: '',
  FORBIDDEN: '403',
  HISTORY: 'History',
  LOGIN: 'Login',
  MODERATOR: 'Moderator',
  NO_MATCH: '**',
  NOT_FOUND: '404',
  POSTS: 'Posts',
  PROCESS: 'Process',
  PROFILE: 'Profile',
  REGISTER: 'Register',
  SETTINGS: 'Settings',
  UPDATE: 'Update',
  VERSION_DIFF: 'Version-diff',
  VERSIONS: 'Versions',
} as const;

export const ADMIN_PATH = {
  USERS: 'Users',
} as const;

export const MODERATOR_PATH = {
  POSTS: 'Posts',
  REVIEW: 'Review',
} as const;

export const APP_ROUTE = {
  ADMIN: `/${APP_PATH.ADMIN.toLowerCase()}`,
  ANALYTICS: `/${APP_PATH.ANALYTICS.toLowerCase()}`,
  AUTHOR: `/${APP_PATH.AUTHOR.toLowerCase()}`,
  CREATION_POST: `/${APP_PATH.PROCESS.toLowerCase()}/${APP_PATH.CREATION.toLowerCase()}`,
  FORBIDDEN: `/${APP_PATH.FORBIDDEN.toLowerCase()}`,
  HISTORY: `/${APP_PATH.HISTORY.toLowerCase()}`,
  HOME: '/',
  LOGIN: `/${APP_PATH.LOGIN.toLowerCase()}`,
  MODERATOR: `/${APP_PATH.MODERATOR.toLowerCase()}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
  POST_MODERATION: `/${APP_PATH.MODERATOR.toLowerCase()}/${MODERATOR_PATH.POSTS.toLowerCase()}`,
  POST_REVIEW: `/${APP_PATH.MODERATOR.toLowerCase()}/${MODERATOR_PATH.POSTS.toLowerCase()}/:id/${MODERATOR_PATH.REVIEW.toLowerCase()}`,
  POSTS: `/${APP_PATH.POSTS.toLowerCase()}`,
  PROFILE: `/${APP_PATH.PROFILE.toLowerCase()}`,
  REGISTER: `/${APP_PATH.REGISTER.toLowerCase()}`,
  UPDATE_POST: `/${APP_PATH.PROCESS.toLowerCase()}/${APP_PATH.UPDATE.toLowerCase()}`,
  USERS: `/${APP_PATH.ADMIN.toLowerCase()}/${ADMIN_PATH.USERS.toLowerCase()}`,
  VERSION_DIFF: `/${APP_PATH.VERSION_DIFF.toLowerCase()}`,
  VERSIONS: `/${APP_PATH.VERSIONS.toLowerCase()}`,
} as const;
