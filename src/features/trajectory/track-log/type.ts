import { Schema, Sources } from "@types";

export type PackagCustomsTrackLoge = Schema.PackagCustomsTrackLog;
export type MawbCustomsTrackLog = Schema.MawbCustomsTrackLog;

export type MawbQueryParams = Sources["/api/customsTrackLog/findMawbList"]["params"];
export type PackageQueryParams = Sources["/api/customsTrackLog/findPackageList"]["params"];

export interface MawbFormValues {
  masterWaybillNoList?: string[];
  waybillStatusCode?: string;
}

export interface PackageFormValues {
  noList?: string[];
  noType?: number;
  actionCode?: string;
}
