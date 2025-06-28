export interface PaginationQueryDto {
  limit?: number;
  page?: number;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
