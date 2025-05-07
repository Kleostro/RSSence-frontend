export class PostsQueryDto {
  public limit?: number;
  public page?: number;
  public search?: string;
  public sortBy?: string;
  public sortOrder?: 'asc' | 'desc';
}
