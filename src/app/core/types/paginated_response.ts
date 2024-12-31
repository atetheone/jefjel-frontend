export interface PaginatedResponse<T> {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string;
  previousPageUrl?: string;
  data: T
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
