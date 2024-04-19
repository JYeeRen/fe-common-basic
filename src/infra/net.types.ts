import { Schema } from "@types";

interface List<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

interface Role {
  "/api/role/createRole": {
    id: number;
  };
  "/api/role/getRoles": List<
    Pick<Schema.Role, "id" | "name" | "active" | "linkedCount">
  >;
  "/api/role/getRoleInfo": Pick<
    Schema.Role,
    "id" | "name" | "active" | "permissions" | "linkedAccounts"
  >;
}

interface Account {
  "/api/account/login": {
    type: string;
    token: string;
    expireIn: number;
    isManager: boolean;
    username: string;
    permissions: string[];
  };
  "/api/account/logout": never;
}

export interface API extends Role, Account {}

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
