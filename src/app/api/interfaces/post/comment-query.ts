import { PAGINATION_QUERY_KEYS, PaginationQueryDto } from '@/app/api/interfaces/pagination-query';

export interface CommentQuery extends PaginationQueryDto {
  isMainAuthor?: boolean;
  status?: string[];
}

export const POST_QUERY_KEYS = [
  ...PAGINATION_QUERY_KEYS,
  'isMainAuthor',
  'status',
] as const satisfies readonly (keyof CommentQuery)[];
