import { Schema, Sources } from "@types";

export type CustomsStatus = Schema.CustomsStatus;

export type CustomsStatusQueryParams =
  Sources["/api/customsStatus/findList"]["params"];

export interface CustomsStatusFormValues {
}
