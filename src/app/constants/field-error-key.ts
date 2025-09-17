export const FIELD_ERROR_KEY = {
  MAX_LENGTH: 'maxlength',
  MIN_LENGTH: 'minlength',
  PATTERN: 'pattern',
  REQUIRED: 'required',
  USERNAME_EXISTS: 'usernameExists',
} as const;
export type FieldErrorKeyType = (typeof FIELD_ERROR_KEY)[keyof typeof FIELD_ERROR_KEY];
