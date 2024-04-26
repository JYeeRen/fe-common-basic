import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface AccountAPI {
  "/api/account/login": {
    params: { account: string; password: string };
    res: {
      userId: number;
      type: string;
      token: string;
      expireIn: number;
      isManager: boolean;
      username: string;
      permissions: string[];
    };
  };
  "/api/account/logout": { params?: never; res: never };
  "/api/account/findAccounts": {
    params: ListParams & {
      account?: string;
      roleId?: Schema.Role["id"];
      activeType?: number;
    };
    res: ListRes<
      Pick<
        Schema.Account,
        | "id"
        | "account"
        | "username"
        | "active"
        | "roleName"
        | "scope"
      >
    >;
  };
  "/api/account/getAccountInfo": {
    params: { id: number };
    res: Pick<
      Schema.Account,
      "id" | "account" | "username" | "roleId" | "active"
    >;
  };
  "/api/account/createAccount": {
    params: Pick<Schema.Account, "account" | "username" | "roleId" | "active">;
    res: never;
  };
  "/api/account/editAccount": {
    params: Pick<
      Schema.Account,
      "id" | "account" | "username" | "roleId" | "active"
    >;
    res: never;
  };
  "/api/account/deleteAccount": {
    params: { id: number };
    res: never;
  };
  "/api/account/resetPassword": {
    params: { id: number };
    res: never;
  };
}


