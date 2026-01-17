import { FIELD_ERROR_KEY } from '@/app/constants/field-error-key';

export const POST_COMMENT_FORM_FIELD_CONFIG = {
  content: {
    max: 5000,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Content must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input your comment!',
    },
  },
} as const;
