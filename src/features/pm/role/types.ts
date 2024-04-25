import { Schema } from "@types";

export type Role = Pick<Schema.Role, "id" | "active" | "linkedCount" | "name">;

export type RoleCreateParams = Pick<
  Schema.Role,
  "name" | "active" | "permissions"
>;

export type RoleParams = RoleCreateParams;

export type Permission = Schema.Permission;

export type RoleDetail = Pick<Schema.Role, "id" | "name" | "active" | "permissions" | "linkedAccounts">;