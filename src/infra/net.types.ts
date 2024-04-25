/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from "@types";

export interface ListRes<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

interface ListParams {
  page: number;
  size: number;
}

interface Api {
  [url: string]: {
    params?: any;
    response?: any;
  };
}

interface Options extends Api {
  "/api/options/getOptions": {
    response: {
      permissions: Schema.Permission[];
    };
  };
  "/api/option/getRoleNames": {
    response: {
      options: { id: number; val: string }[];
    };
  };
}

interface Role extends Api {
  "/api/role/createRole": {
    params: Pick<Schema.Role, "name" | "active" | "permissions">;
    response: {
      id: number;
    };
  };
  "/api/role/getRoles": {
    params: ListParams;
    response: ListRes<
      Pick<Schema.Role, "id" | "name" | "active" | "linkedCount">
    >;
  };
  "/api/role/getRoleInfo": {
    response: Pick<
      Schema.Role,
      "id" | "name" | "active" | "permissions" | "linkedAccounts"
    >;
  };
}

interface Account extends Api {
  "/api/account/login": {
    response: {
      userId: number;
      type: string;
      token: string;
      expireIn: number;
      isManager: boolean;
      username: string;
      permissions: string[];
    };
  };
  "/api/account/logout": { response: never };
  "/api/account/findAccounts": {
    params: {
      account?: string;
      roleId?: Schema.Role["id"];
      activeType?: boolean;
      page: number;
      size: number;
    };
    response: ListRes<
      Pick<
        Schema.Account,
        | "id"
        | "account"
        | "username"
        | "active"
        | "roleName"
        | "isManager"
        | "scope"
      >
    >;
  };
  "/api/account/getAccountInfo": {
    params: { id: number };
    response: Pick<
      Schema.Account,
      "id" | "account" | "username" | "roleId" | "active"
    >;
  };
  "/api/account/createAccount": {
    params: Pick<Schema.Account, "account" | "username" | "roleId" | "active">;
  };
  "/api/account/editAccount": {
    params: Pick<
      Schema.Account,
      "id" | "account" | "username" | "roleId" | "active"
    >;
  };
}

export type API = Role & Account & Options;

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
