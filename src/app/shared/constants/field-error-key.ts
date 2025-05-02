export const FIELD_ERROR_KEY = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minlength',
  MAX_LENGTH: 'maxlength',
  USERNAME_EXISTS: 'usernameExists',
} as const;
export type FieldErrorKeyType = (typeof FIELD_ERROR_KEY)[keyof typeof FIELD_ERROR_KEY];
