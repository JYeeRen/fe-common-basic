export interface API {
  '/api/account/login': {
    "type": string;
    "token": string;
    "expireIn": number;
    "isManager": boolean;
  };
  '/api/account/logout': never;
}

export interface ApiRes<T = unknown> {
  code: number;
  data: T;
}