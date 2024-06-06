import { Schema, Sources } from "@types";

export type WarehouseReceipt = Schema.WarehouseReceipt;

export type WarehouseReceiptQueryParams =
    Sources["/api/warehouse/receipt/findList"]["params"];

export type WarehouseCargoTrackQueryParams =
    Sources["/api/warehouse/receipt/findTrackList"]["params"];

export interface WarehouseReceiptFormValues {
}

export interface WarehouseCargoTrackFormValues {
}
