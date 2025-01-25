export const APP_PATH = {
  DEFAULT: '',
  LOGIN: 'Login',
  SIGN_UP: 'Signup',
  NOT_FOUND: '404',
  NO_MATCH: '**',
} as const;

export const APP_ROUTE = {
  LOGIN: `/${APP_PATH.LOGIN.toLowerCase()}`,
  SIGN_UP: `/${APP_PATH.SIGN_UP.toLowerCase()}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
} as const;
