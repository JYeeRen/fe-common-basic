import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface RoleAPI {
  "/api/role/createRole": {
    params: Pick<Schema.Role, "name" | "active" | "permissions">;
    res: { id: number };
  };
  "/api/role/getRoles": {
    params: ListParams;
    res: ListRes<Pick<Schema.Role, "id" | "name" | "active" | "linkedCount">>;
  };
  "/api/role/getRoleInfo": {
    params: { id: number };
    res: Pick<
      Schema.Role,
      "id" | "name" | "active" | "permissions" | "linkedAccounts"
    >;
  };
  "/api/role/deleteRole": {
    params: { id: number };
    res: never;
  };
  "/api/role/unlinkAccount": {
    params: { accountId: number };
    res: never;
  };
  "/api/role/editRole": {
    params: Pick<Schema.Role, "id" | "name" | "active" | "permissions">;
    res: never;
  };
}
