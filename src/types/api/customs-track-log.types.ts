import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface CustomsTrackLogAPI {
  "/api/customsTrackLog/findPackageList": {
    params: ListParams & {
      noList?: string[];
      noType?: number;
      actionCode?: string;
    };
    res: ListRes<Schema.PackagCustomsTrackLog>;
  };
  "/api/customsTrackLog/findMawbList": {
    params: ListParams & {
      masterWaybillNoList?: string[];
      waybillStatusCode?: string;
    };
    res: ListRes<Schema.MawbCustomsTrackLog>;
  };
  "/api/customsTrackLog/findMawbStatusList": {
    params: ListParams & {
      masterWaybillNoList?: string[];
    };
    res: ListRes<Schema.MawbStatus>;
  }
  "/api/customsTrackLog/uploadMawbTrack": {
    params: { ids: number[] };
    res?: never;
  }
  "/api/customsTrackLog/uploadPackageTrack": {
    params: { ids: number[] };
    res?: never;
  }
}
