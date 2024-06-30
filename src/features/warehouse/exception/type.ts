import {Schema, Sources} from "@types";

export type DeductionStruct = Schema.Deduction;

export type DeductionInitiate = Schema.DeductionInitiate;

export type WarehouseDeductionQueryParam =
    Sources["/api/warehouse/deduction/findList"]["params"];

export interface WarehouseDeductionFormValues {
}