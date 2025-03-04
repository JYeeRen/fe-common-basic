import * as Schema from "../schema";
import { File, ListParams, ListRes } from "./common.types";

export interface DataStatisticsAPI {
  "/api/dataStatistics/exportBillOfLading": {
    params: {
      ids: number[];
      date: string;
      shipFromName: string;
      shipFromAddress: string;
      shipToVendorId: number;
      carrierVendorId: number;
    };
    res: File;
  };
  "/api/dataStatistics/getSetting": {
    params?: never;
    res: {
      providerNames: string[];
      provider: {
        name: string;
        ids: number[];
        others: Record<string, number[]>;
      }
    };
  };
  "/api/dataStatistics/setSetting": {
    params: {
      providerNames: string[];
      provider: {
        name: string;
        ids: number[];
        others: Record<string, number[]>;
      }
    };
    res: never;
  };
  "/api/dataStatistics/findList": {
    params: ListParams & {
      masterWaybillNoList?: string[];
      ata?: {
        zone: string;
        start: string;
        end: string;
      };
      portCode?: string;
      flightNumber?: string;
      tailProviderName?: string;
      orderKeys?: { key: string; order: string }[];
    };
    res: ListRes<Schema.WaybillStatistics> & {
      orderKeys: { key: string; order: string }[];
      notFindList: string[];
    };
  };
  "/api/dataStatistics/export": {
    params: {
      masterWaybillNoList?: string[];
      ata?: {
        zone: string;
        start: string;
        end: string;
      };
      portCode?: string;
      flightNumber?: string;
      tailProviderName?: string;
      orderKeys?: { key: string; order: string }[];
    };
    res: never;
  };
  "/api/dataStatistics/setPmc": {
    params: {
      id: number;
      pmc: string;
    };
    res: never;
  };
}
