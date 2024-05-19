import { Schema, Sources } from "@types";

export type CustomsTrack = Schema.MawbCustomsTrack;

export type QueryParams = Sources["/api/customsTrack/findMawbList"]["params"];

export interface FormValues {
  noList?: string[];
  noType?: number;
  actionCode?: string;
}

// export type Mawb = Pick<
//   Schema.MawbCustomsTrack,
//   "id" | "bigBagNo" | "providerOrderId" | "declarationBillId" | "trackingNo"
// >;

export type AddMawbTrackFormValues = {
  ids: number[];
  operateTime: string;
  timeZone: string;
  actionCode: string;
};

export type UploadRes = Sources["/api/customsTrack/uploadMawbTrack"]["res"];
