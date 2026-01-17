import { FIELD_ERROR_KEY } from '@/app/constants/field-error-key';

export const POST_REJECT_FORM_FIELD_CONFIG = {
  comment: {
    max: 256,
    messages: {
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input your comment!',
    },
  },
  reasons: {
    messages: {
      [FIELD_ERROR_KEY.REQUIRED]: 'Please select a reason!',
    },
  },
} as const;
