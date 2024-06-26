import { Schema, Sources } from "@types";

export type WarehouseReceipt = Schema.WarehouseReceipt;

export type CargoTrack = Schema.CargoTrack;

export type WarehouseReceiptQueryParams =
    Sources["/api/warehouse/receipt/findList"]["params"];

export type WarehouseCargoTrackQueryParams =
    Sources["/api/warehouse/track/findList"]["params"];

export interface WarehouseReceiptFormValues {
}

export interface WarehouseCargoTrackFormValues {
}

export type UploadRes = Sources["/api/warehouse/receipt/upload"]["res"];
