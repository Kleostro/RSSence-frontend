export const FIELD_ERROR_KEY = {
  EMAIL: 'email',
  MAX_LENGTH: 'maxlength',
  MIN_LENGTH: 'minlength',
  PASSWORD_MISMATCH: 'passwordMismatch',
  PATTERN: 'pattern',
  REQUIRED: 'required',
  USERNAME_EXISTS: 'usernameExists',
} as const;
export type FieldErrorKeyType = (typeof FIELD_ERROR_KEY)[keyof typeof FIELD_ERROR_KEY];
