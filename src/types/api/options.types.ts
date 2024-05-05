import { Schema } from "@types";
import { Option } from "../common";

export interface OptionsAPI {
  "/api/option/getBase": {
    params?: never;
    res: {
      actives: Option[];
      customsItemInfoOtherTypes: Option[];
      mawbStatuses: Option[];
      packageStatuses: Option[];
      customsStatusNoTypes: Option[];
      customsStatusTypes: Option[];
      timeZones: Option[];
      templateTypes: Option[];
      templateColumns: { key: string; cnName: string; enName: string }[];
      unitTypes: Option[];
      tikTokActionCodeList: Option[];
      tikTokReasonCodeList: Option[];
      tikTokWaybillStatusList: Option[];
    };
  };
  "/api/option/getRoleNames": {
    params?: never;
    res: { options: Option[] };
  };
  "/api/option/getPermissions": {
    params?: never;
    res: { permissions: Schema.Permission[] };
  }
}
