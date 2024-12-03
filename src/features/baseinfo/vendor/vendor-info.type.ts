import { Schema, Sources } from "@types";

export type VendorInfo = Schema.VendorInfo;

export type VendorInfoQueryParam = Sources["/api/warehouse/vendor/findList"]["params"];

export interface VendorInfoFormValues {
}