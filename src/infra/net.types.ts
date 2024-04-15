export interface API {
  '/api/account/login': {
    "type": string;
    "token": string;
    "expireIn": number;
    "isManager": boolean;
  };
  '/api/account/logout': never;
}

export type ApiRes<T = unknown> = ApiSuccess<T> | ApiError;

export interface ApiSuccess<T = unknown> {
  code: 0;
  data: T;
}

export interface ApiError {
  code: 1002;
  data: unknown;
  msg?: string;
}