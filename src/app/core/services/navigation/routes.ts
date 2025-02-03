export const APP_PATH = {
  DEFAULT: '',
  LOGIN: 'Login',
  SIGN_UP: 'Sign-up',
  PROFILE: 'Profile',
  NOT_FOUND: '404',
  NO_MATCH: '**',
} as const;

export const APP_ROUTE = {
  LOGIN: `/${APP_PATH.LOGIN.toLowerCase()}`,
  SIGN_UP: `/${APP_PATH.SIGN_UP.toLowerCase()}`,
  PROFILE: `/${APP_PATH.PROFILE.toLowerCase()}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
  HOME: '/',
} as const;
