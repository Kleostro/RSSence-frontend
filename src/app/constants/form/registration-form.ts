import { FIELD_ERROR_KEY } from '@/app/constants/field-error-key';

export const REGISTRATION_FORM_FIELD_CONFIG = {
  confirm: {
    max: 32,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Password must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: 'Password must be at least {{ min }} characters long.',
      [FIELD_ERROR_KEY.PASSWORD_MISMATCH]: 'Passwords do not match!',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input password!',
    },
    min: 8,
  },
  email: {
    messages: {
      [FIELD_ERROR_KEY.EMAIL]: 'Please input valid email!',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input email!',
    },
  },
  password: {
    max: 32,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Password must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: 'Password must be at least {{ min }} characters long.',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input password!',
    },
    min: 8,
  },
} as const;
