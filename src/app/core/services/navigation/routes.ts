export const APP_PATH = {
  DEFAULT: '',
  LOGIN: 'Login',
  SIGN_UP: 'Sign-up',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  AUTHOR: 'Author',
  POSTS: 'Posts',
  NOT_FOUND: '404',
  NO_MATCH: '**',
} as const;

export const APP_ROUTE = {
  LOGIN: `/${APP_PATH.LOGIN.toLowerCase()}`,
  SIGN_UP: `/${APP_PATH.SIGN_UP.toLowerCase()}`,
  PROFILE: `/${APP_PATH.PROFILE.toLowerCase()}`,
  PROFILE_SETTINGS: `/${APP_PATH.PROFILE.toLowerCase()}/${APP_PATH.SETTINGS.toLowerCase()}`,
  AUTHOR: `/${APP_PATH.AUTHOR.toLowerCase()}`,
  POSTS: `/${APP_PATH.POSTS.toLowerCase()}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
  HOME: '/',
} as const;
