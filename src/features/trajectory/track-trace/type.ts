import { Schema, Sources } from "@types";

export type CustomsTrackStatus = Schema.CustomsTrackStatus;

export type CustomsTrackStatusQueryParams =
  Sources["/api/customsTrackStatus/findList"]["params"];

export interface CustomsTrackStatusFormValues {
  noList?: string;
  noType?: number;
  statusType?: number;
}
