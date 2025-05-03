import { FIELD_ERROR_KEY } from '@/app/shared/constants/field-error-key';

export const AUTHOR_FORM_FIELD_CONFIG = {
  bio: {
    max: 500,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Bio must be at most {{ max }} characters long.',
    },
  },
  firstname: {
    max: 16,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'First name must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: 'First name must be at least {{ min }} characters long.',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input your first name!',
    },
    min: 3,
  },
  lastname: {
    max: 32,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Last name must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: 'Last name must be at least {{ min }} characters long.',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input your last name!',
    },
    min: 3,
  },
  username: {
    max: 16,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Username must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: 'Username must be at least {{ min }} characters long.',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input your username!',
      [FIELD_ERROR_KEY.USERNAME_EXISTS]: 'This username is already taken.',
    },
    min: 3,
  },
} as const;

export const FORM_CONTROL_NAME = {
  AVATAR: 'avatar',
} as const;

export const FORM_STATE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type FormState = (typeof FORM_STATE)[keyof typeof FORM_STATE];
