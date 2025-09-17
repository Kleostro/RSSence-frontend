/* eslint-disable max-len */
import { FIELD_ERROR_KEY } from '@/app/constants/field-error-key';

export const POST_FORM_FIELD_CONFIG = {
  content: {
    max: 5000,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Content must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: 'Content must be at least {{ min }} characters long.',
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input your content!',
    },
    min: 50,
  },
  title: {
    max: 150,
    messages: {
      [FIELD_ERROR_KEY.MAX_LENGTH]: 'Title must be at most {{ max }} characters long.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: 'Title must be at least {{ min }} characters long.',
      [FIELD_ERROR_KEY.PATTERN]:
        "Title must contain only letters, numbers, spaces, hyphens (-), and apostrophes ('). No special characters allowed.",
      [FIELD_ERROR_KEY.REQUIRED]: 'Please input your title!',
    },
    min: 10,
    pattern: /^[a-zA-Zа-яА-Я0-9\s\-']+$/,
  },
} as const;
