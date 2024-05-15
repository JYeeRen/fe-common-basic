import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface CustomsTrackAPI {
  "/api/customsTrack/findPackageList": {
    params: ListParams & {
      noList?: string[];
      noType?: number;
      actionCode?: string;
    };
    res: ListRes<Schema.PackageCustomsTrack>;
  };
  "/api/customsTrack/findMawbList": {
    params: ListParams & {
      masterWaybillNoList?: string[];
      departPortCode?: string;
      arrivePortCode?: string;
      flightDate?: {
        zone?: string;
        start: string;
        end: string;
      };
      etd?: {
        zone?: string;
        start: string;
        end: string;
      };
      eta?: {
        zone?: string;
        start: string;
        end: string;
      };
      atd?: {
        zone?: string;
        start: string;
        end: string;
      };
      ata?: {
        zone?: string;
        start: string;
        end: string;
      };
    };
    res: ListRes<Schema.MawbCustomsTrack>;
  };
  "/api/customsTrack/findAddPackageList": {
    params: ListParams & {
      noList?: string[];
      noType?: number;
      actionCode?: string;
    };
    res: ListRes<
      Pick<
        Schema.PackageCustomsTrack,
        | "id"
        | "bigBagNo"
        | "providerOrderId"
        | "declarationBillId"
        | "trackingNo"
      >
    >;
  };
  "/api/customsTrack/addPackageTrack": {
    params: {
      ids: number[];
      operateTime: string;
      timeZone: string;
      actionCode: string;
    };
    res: { failed: { number: string; reason: string }[] };
  };
}
