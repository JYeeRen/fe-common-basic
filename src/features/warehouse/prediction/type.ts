import { Schema, Sources } from "@types";

export type WarehouseReceipt = Schema.WarehouseReceipt;

export type CargoTrack = Schema.CargoTrack;

export type WarehouseReceiptQueryParams =
    Sources["/api/warehouse/receipt/findList"]["params"];

export type WarehouseCargoTrackQueryParams =
    Sources["/api/warehouse/track/findList"]["params"];

export type WarehouseInBoundQueryParams = Sources["/api/warehouse/receipt/inbound"]["params"];

export interface WarehouseReceiptFormValues {
}

export interface WarehouseCargoTrackFormValues {
}

export type UploadRes = Sources["/api/warehouse/receipt/upload"]["res"];

export type InBoundRes = Sources["/api/warehouse/receipt/inbound"]["res"];
