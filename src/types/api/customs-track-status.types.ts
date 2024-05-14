import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface CustomsTrackStatusAPI {
  "/api/customsTrackStatus/findList": {
    params: ListParams & {
      noList?: string[];
      noType?: number;
      statusType?: string;
    };
    res: ListRes<Schema.CustomsTrackStatus>;
  };
}
