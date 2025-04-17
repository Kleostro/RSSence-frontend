export const AUTHOR_FORM_FIELD_BOUNDARIES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 16,
  BIO_MAX_LENGTH: 500,
} as const;

export const FORM_CONTROL_NAME = {
  AVATAR: 'avatar',
} as const;

export const FORM_STATE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type FormState = (typeof FORM_STATE)[keyof typeof FORM_STATE];
