import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface CustomsTrackAPI {
  "/api/customsTrack/findPackageList": {
    params: ListParams & {
      noList: string[];
      noType: number;
      actionCode: string;
    };
    res: ListRes<Schema.CustomsTrack>;
  };
}
