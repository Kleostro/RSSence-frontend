export const PROFILE_FORM_FIELD_BOUNDARIES = {
  FIRSTNAME_MIN_LENGTH: 3,
  FIRSTNAME_MAX_LENGTH: 16,
  LASTNAME_MIN_LENGTH: 3,
  LASTNAME_MAX_LENGTH: 32,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 16,
  BIO_MAX_LENGTH: 500,
} as const;

export const FORM_CONTROL_NAME = {
  AVATAR: 'avatar',
  BIRTHDATE: 'birthdate',
} as const;

export const FORM_STATE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type FormState = (typeof FORM_STATE)[keyof typeof FORM_STATE];
