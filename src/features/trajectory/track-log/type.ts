import { Schema, Sources } from "@types";

export type PackagCustomsTrackLoge = Schema.PackagCustomsTrackLog;
export type MawbCustomsTrackLog = Schema.MawbCustomsTrackLog;
export type MawbStatus = Schema.MawbStatus;
export type MawbQueryParams = Sources["/api/customsTrackLog/findMawbList"]["params"];
export type PackageQueryParams = Sources["/api/customsTrackLog/findPackageList"]["params"];
export type StatusQueryParams = Sources["/api/customsTrackLog/findMawbStatusList"]["params"];

export interface MawbFormValues {
  masterWaybillNoList?: string[];
  waybillStatusCode?: string;
}

export interface PackageFormValues {
  noList?: string[];
  noType?: number;
  actionCode?: string;
}
