import {Schema, Sources} from "@types";

export type PalletInfo = Schema.PalletInfo;

export type PalletInfoQueryParam =
    Sources["/api/warehouse/pallet_merge/findList"]["params"];

export interface PalletInfoFormValues {
}