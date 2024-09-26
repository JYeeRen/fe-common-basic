import { Schema } from "@types";
import { Option } from "../common";

export interface TZ {
  offsetMMHH: boolean;
  offset: number;
  text: string;
  value: string;
}

export interface BackendOptions {
  actives: Option[];
  customsItemInfoOtherTypes: Option[];
  mawbStatuses: Option[];
  packageStatuses: Option[];
  customsStatusNoTypes: Option[];
  customsStatusTypes: Option[];
  timeZones: TZ[];
  templateTypes: Option[];
  templateColumns: {
    key: string;
    cnName: string;
    enName: string;
    amountUnits?: string[];
    isMerge?: boolean;
  }[];
  unitTypes: { key: string; val: string }[];
  actionCodeList: { code: string; name: string }[];
  reasonCodeList: { code: string; name: string }[];
  waybillTrackStatusList: { code: string; name: string }[];
  customsTrackPackageNoTypes: Option[];
  customsTrackStatusNoTypes: Option[];
  customsTrackStatusTypes: Option[];
  // tikTokActionCodeList: { code: string; name: string }[];
  // tikTokReasonCodeList: { code: string; name: string }[];
  // tikTokWaybillStatusList: { code: string; name: string }[];
  // customTemplateTypes: Option[];
}

export interface OptionsAPI {
  "/api/option/getTailProviders": {
    params?: never;
    res: {
      providers: { key: string; val: string }[];
    }
  };
  "/api/option/getBase": {
    params?: never;
    res: BackendOptions;
  };
  "/api/option/getRoleNames": {
    params?: never;
    res: { options: { id: number; val: string }[] };
  };
  "/api/option/getPermissions": {
    params?: never;
    res: { permissions: Schema.Permission[] };
  };
  "/api/option/getCustomsTemplates": {
    params?: never;
    res: { templates: { id: number; val: string }[] };
  };
  "/api/option/getPrealertTemplates": {
    params?: never;
    res: { templates: { id: number; val: string }[] };
  };
  "/api/warehouse/option/getTailProviders": {
    params?: never;
    res: { providers: { id: number; val: string }[] };
  };
  "/api/warehouse/option/getVendorTypes": {
    params?: never;
    res: { vendorTypes: { id: number; val: string }[] };
  };
  "/api/warehouse/option/getPortCodes": {
    params?: never;
    res: { portCodes: string[] };
  }
}
