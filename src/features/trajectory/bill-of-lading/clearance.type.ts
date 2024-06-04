import { Schema, Sources } from "@types";

export type Clearance = Schema.Clearance;

export type QueryParams = Sources["/api/customsDocument/findClearanceList"]["params"];

export interface FormValues {
  noList?: string[];
  noType?: number;
  actionCode?: string;
}

export type UploadRes = Sources["/api/customsDocument/uploadClearanceFiles"]["res"];
