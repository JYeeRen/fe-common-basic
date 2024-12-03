import { ListParams, ListRes } from "./common.types.ts";
import * as Schema from "../schema";

export interface BaseInfoAPI {
  "/api/warehouse/vendor/findList": {
    params: ListParams & {
      name?: string;
      type?: number;
      active?: number;
    };
    res: ListRes<Schema.VendorInfo>;
  }

  "/api/warehouse/vendor/getInfo": {
    params: {
      id?: number;
    };
    res: Schema.VendorInfo;
  }

  "/api/warehouse/vendor/create": {
    params: Schema.VendorInfo;
    res: never;
  };

  "/api/warehouse/vendor/edit": {
    params: Schema.VendorInfo;
    res: never;
  };

  "/api/warehouse/vendor/delete": {
    params: {
      id: number
    };
    res: never;
  }

  "/api/warehouse/vendor/setActive": {
    params: {
      ids?: number[];
      active: boolean;
    };
    res: never;
  };
}