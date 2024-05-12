export interface ListRes<T> {
  list: T[] | null;
  total: number;
  page: number;
  size: number;
}

export interface ListParams {
  page: number;
  size: number;
}

export interface File {
  filename: string;
  url: string;
}