export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    totalPage: number;
    activePage: number;
    limitPage: number;
  };
}
