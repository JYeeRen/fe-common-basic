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
}
