export const APP_PATH = {
  AUTHOR: 'Author',
  DEFAULT: '',
  LOGIN: 'Login',
  NO_MATCH: '**',
  NOT_FOUND: '404',
  POSTS: 'Posts',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  SIGN_UP: 'Sign-up',
} as const;

export const APP_ROUTE = {
  AUTHOR: `/${APP_PATH.AUTHOR.toLowerCase()}`,
  HOME: '/',
  LOGIN: `/${APP_PATH.LOGIN.toLowerCase()}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
  POSTS: `/${APP_PATH.POSTS.toLowerCase()}`,
  PROFILE: `/${APP_PATH.PROFILE.toLowerCase()}`,
  PROFILE_SETTINGS: `/${APP_PATH.PROFILE.toLowerCase()}/${APP_PATH.SETTINGS.toLowerCase()}`,
  SIGN_UP: `/${APP_PATH.SIGN_UP.toLowerCase()}`,
} as const;
