import {Schema, Sources} from "@types";

export type WarehouseOutbound = Schema.WarehouseOutbound;

export type WarehouseOutboundQueryParam =
    Sources["/api/warehouse/order/findList"]["params"];

export interface WarehouseOutboundFormValues {
}