import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface DataStatisticsAPI {
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
  }
}
