import { Schema } from "@types";
import { ListParams, ListRes } from "./common.types";

export interface CustomTemplateAPI {
  "/api/customsTemplate/findList": {
    params: ListParams & {
      templateId?: number;
      templateName?: "string";
      templateType?: number;
      active?: number;
    };
    res: ListRes<
      Pick<Schema.CustomTemplate, "id" | "active" | "name" | "type">
    >;
  };
  "/api/customsTemplate/delete": {
    params: { id: number };
    res: never;
  };
  "/api/customsTemplate/create": {
    params: Omit<Schema.CustomTemplate, "id">;
    res: never;
  };
  "/api/customsTemplate/edit": {
    params: Schema.CustomTemplate;
    res: never;
  };
  "/api/customsTemplate/getInfo": {
    params: {id: number };
    res: Schema.CustomTemplate;
  }
}
