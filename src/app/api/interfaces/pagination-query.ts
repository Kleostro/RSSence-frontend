export interface PaginationQueryDto {
  filter?: string;
  filterField?: string;
  limit?: number;
  page?: number;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
