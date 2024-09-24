import { Schema, Sources } from "@types";

export type CustomItem = Schema.CustomItem;

export type TemplateListQueryParams =
  Sources["/api/customsTemplate/findList"]["params"];

export type CustomTemplate = Pick<
  Schema.CustomTemplate,
  "id" | "name" | "active" | "type"
>;

export interface CustomTemplateListOperations {
  view: (id: number) => void;
  edit: (id: number) => void;
  delete: (id: number) => void;
}

export type CustomsTemplate = Schema.CustomTemplate;

export type CustomTemplateCol = {
  uuid: string;
  type?: 'predefined' | 'custom';
  key: string;
  index?: number;
  cnName: string;
  enName: string;
  exportName?: string;
  fixedValue?: string;
  interceptBefore?: boolean;
  interceptBeforeStart?: number;
  interceptBeforeEnd?: number;
  interceptAfter?: boolean;
  interceptAfterStart?: number;
  interceptAfterEnd?: number;
  targetUnit?: string;
  mergence?: boolean;
  selectUnit?: boolean;
  amountUnit?: string;
  isMerge?: boolean;
}

export interface CustomTemplateParams {
  name: string;
  type: number;
  active: boolean;
  mergeOrderNumber: boolean;
  columns: CustomTemplateCol[];
}

export interface CustomTemplateFormValues {
  name: string;
  type: number;
  active: boolean;
  mergeOrderNumber: boolean;
  typesetting: number;
}

export interface TemplateColOption {
  key: string;
  cnName: string;
  enName: string;
}

export interface CustomITemsQueryParams {
  createTime?: {
    zone: string;
    start: string;
    end: string;
  };
  masterWaybillNoList?: string[];
  bigBagNoList?: string[];
  otherType?: number;
  otherList?: string[];
  customerName?: string;
}