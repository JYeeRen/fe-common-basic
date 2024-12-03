import { Schema, Sources } from "@types";

export type CustomsTrack = Schema.PackageCustomsTrack;

export type QueryParams =
  Sources["/api/customsTrack/findPackageList"]["params"];

export interface FormValues {
  noList?: string[];
  noType?: number;
  actionCode?: string;
  uploadStatus?: number;
}

export type Package = Pick<
  Schema.PackageCustomsTrack,
  | "masterWaybillNo"
  | "id"
  | "bigBagNo"
  | "providerOrderId"
  | "declarationBillId"
  | "trackingNo"
  | "nextProviderName"
>;

export type AddPacakageTrackFormValues = {
  ids: number[];
  operateTime: string;
  timeZone: string;
  status: number;
  reason?: string;
  loadingType?: string;
  handoverType?: string;
  truckType?: string;
  transferDestinationPort?: string;
};
