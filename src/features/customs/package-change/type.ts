import { Schema, Sources } from "@types";

export type PacakgeChange = Schema.PacakgeChange;

export type QueryParams =
  Sources["/api/packageStatus/findPackageLinkChanges"]["params"];

export interface FormValues {
}
