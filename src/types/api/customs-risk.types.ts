import * as Schema from "../schema";
import { ListParams, ListRes } from "./common.types";

export interface CustomsRiskAPI {
  "/api/customsRisk/findList": {
    params: ListParams & {
      productName?: string;
      productNameCn?: string;
      exportHsCode?: string;
      importHsCode?: string;
    };
    res: ListRes<Schema.CustomsRisk>;
  };
}
