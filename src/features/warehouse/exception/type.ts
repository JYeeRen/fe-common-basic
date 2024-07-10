import {Schema, Sources} from "@types";

export type DeductionStruct = Schema.Deduction;

export type DeductionInitiate = Schema.DeductionInitiate;

export type ReceiptIssue = Schema.ReceiptIssue;

export type ReceiptIssueLink = Schema.ReceiptIssueLink;

export type WarehouseDeductionQueryParam = Sources["/api/warehouse/deduction/findList"]["params"];

export type WarehouseProblemQueryParam = Sources["/api/warehouse/receiptIssue/findList"]["params"];

export type WarehouseProblemLinkQueryParam = Sources["/api/warehouse/receiptIssue/findLinkList"]["params"];

export interface WarehouseDeductionFormValues {
}

export interface WarehouseProblemFormValues {
}