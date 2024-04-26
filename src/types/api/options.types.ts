import { Schema } from "@types";
import { Option } from "../common";

export interface OptionsAPI {
  "/api/option/getBase": {
    params?: never;
    res: {
      actives: Option[];
      commodityInformationOtherTypes: Option[];
      mawbStatuses: Option[];
      packageStatuses: Option[];
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
