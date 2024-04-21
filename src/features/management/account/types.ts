import { Schema } from "@types";

export type AccountItem = Pick<
  Schema.Account,
  "id" | "account" | "username" | "roleName" | "active" | 'isManager'
>;

export type Account = Pick<
  Schema.Account,
  "id" | "account" | "username" | "roleId" | "active"
>;

export type AccountParams = Omit<Account, "id">;

export type Role = Pick<Schema.Role, "id" | "name">;
