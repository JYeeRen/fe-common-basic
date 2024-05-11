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
      timeZones: { key: string; val: string }[];
      templateTypes: Option[];
      templateColumns: { key: string; cnName: string; enName: string }[];
      unitTypes: { key: string; val: string }[];
      tikTokActionCodeList: { code: string; name: string }[];
      tikTokReasonCodeList: { code: string; name: string }[];
      tikTokWaybillStatusList: { code: string; name: string }[];
      customTemplateTypes: Option[];
    };
  };
  "/api/option/getRoleNames": {
    params?: never;
    res: { options: { id: number; val: string }[] };
  };
  "/api/option/getPermissions": {
    params?: never;
    res: { permissions: Schema.Permission[] };
  };
}
