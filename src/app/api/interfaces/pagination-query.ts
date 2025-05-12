export class PaginationQueryDto {
  public limit?: number;
  public page?: number;
  public search?: string;
  public searchField?: string;
  public sortBy?: string;
  public sortOrder?: 'asc' | 'desc';
}
