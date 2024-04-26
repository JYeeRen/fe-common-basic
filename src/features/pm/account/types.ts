import { Schema, Sources } from "@types";

export type AccountItem = Pick<
  Schema.Account,
  "id" | "account" | "username" | "active" | "roleName" | "scope"
>;

export type Account = Pick<
  Schema.Account,
  "id" | "account" | "username" | "roleId" | "active"
>;

export type AccountParams = Omit<Account, "id">;

export type Role = Pick<Schema.Role, "id" | "name">;

export type QueryParams = Sources["/api/account/findAccounts"]["params"];
