import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface CustomsStatusAPI {
  "/api/customsStatus/findList": {
    params: ListParams & {
      noList?: string[];
      noType?: number;
      uploadDate?: {
        zone: string;
        start: string;
        end: string;
      };
      flightDate?: {
        zone: string;
        start: string;
        end: string;
      };
      customsStatusType?: string;
    };
    res: ListRes<Schema.CustomsStatus>;
  };

  "/api/customsStatus/editRemark": {
    params: {
      id: number;
      remark: string;
    };
    res: never;
  };
  "/api/customsStatus/createDocument": {
    params: {
      ids: number[];
    };
    res: never;
  };
  "/api/customsStatus/export": {
    params?: {
      noList?: string[];
      noType?: number;
      uploadDate?: {
        zone: string;
        start: string;
        end: string;
      };
      flightDate?: {
        zone: string;
        start: string;
        end: string;
      };
      customsStatusType?: string;
    };
    res: { filename: string; url: string };
  };
}
