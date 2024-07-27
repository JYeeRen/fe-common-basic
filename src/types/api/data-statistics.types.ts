import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface DataStatisticsAPI {
  "/api/dataStatistics/getSetting": {
    params?: never;
    res: {
      providerNames: string[];
    };
  };
  "/api/dataStatistics/setSetting": {
    params: { providerNames: string[] };
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
