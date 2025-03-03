import { ImportRes } from "@types";
import { File } from "./common.types";

export interface PackageMidCodeAPI {
  "/api/packageMidCode/download": {
    params: {
      waybillId: number;
    };
    res: File;
  };
  "/api/packageMidCode/upload": {
    // params: {
    //   timeZone: string;
    //   file: FormData;
    // };
    params: FormData;
    res: ImportRes;
  }
}