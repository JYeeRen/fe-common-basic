import { Schema } from "@types";
import { ListParams, ListRes } from "./common.types";

export interface PackageStatusAPI {
  "/api/packageStatus/findPackageLinkChanges": {
    params: ListParams & {
      masterWaybillNoList?: string[];
    };
    res: ListRes<Schema.PacakgeChange>;
  };
  "/api/packageStatus/exportPackageLinkChanges": {
    params: { ids: { id: number, changeTypeValue: number }[] };
    res: { filename: string; url: string };
  }
}
