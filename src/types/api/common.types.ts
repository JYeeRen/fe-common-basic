export interface ListRes<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface ListParams {
  page: number;
  size: number;
}