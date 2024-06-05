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
  "/api/customsTrack/exportMawbTrack": {
    params: CustomsTrackAPI["/api/customsTrack/findMawbList"]["params"];
    res: { url: string; fileName: string };
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
        | "masterWaybillNo"
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
  "/api/customsTrack/downloadTemplate": {
    params?: never;
    res: { url: string; fileName: string };
  };
  "/api/customsTrack/addMawbTrack": {
    params: {
      ids: number[];
      operateTime: string;
      waybillStatusCode: string;
      timeZone: string;
    };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsTrack/checkMawbTrackFile": {
    // params: { file: unknown, timeZone: string };
    params: FormData;
    res: {
      formatError: { number: string; reason: string }[];
      numberError: { number: string; reason: string }[];
      timeChange: { number: string; reason: string }[];
      timeout: { number: string; reason: string }[];
    };
  };
  "/api/customsTrack/uploadMawbTrack": {
    // params: { file: unknown, timeZone: string };
    params: FormData;
    res: {
      failed: { number: string; reason: string }[];
      total: number;
      success: number;
    };
  };
  "/api/customsTrack/setMawbAta": {
    params: {
      ids: number[];
      time: string;
      timeZone: string;
    };
    res: {
      failed: { number: string; reason: string }[];
    };
  };
  "/api/customsTrack/setMawbAtd": {
    params: {
      ids: number[];
      time: string;
      timeZone: string;
    };
    res: {
      failed: { number: string; reason: string }[];
    };
  };
  "/api/customsTrack/setPackageDelivered": {
    params: {
      ids: number[];
      time: string;
      timeZone: string;
    };
    res: {
      failed: { number: string; reason: string }[];
    };
  };
  "/api/customsTrack/setPackagePickedUp": {
    params: {
      ids: number[];
      time: string;
      timeZone: string;
    };
    res: {
      failed: { number: string; reason: string }[];
    };
  };
}
