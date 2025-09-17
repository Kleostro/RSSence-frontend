export interface PaginationQueryDto {
  limit?: number;
  page?: number;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const PAGINATION_QUERY_KEYS = [
  'page',
  'limit',
  'search',
  'searchField',
  'sortBy',
  'sortOrder',
] as const satisfies readonly (keyof PaginationQueryDto)[];
