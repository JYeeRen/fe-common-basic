import {ListParams, ListRes} from "./common.types.ts";
import * as Schema from "../schema";

export interface WarehouseAPI {
    "/api/warehouse/receipt/findList": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
        };
        res: ListRes<Schema.WarehouseReceipt>;
    };

    "/api/warehouse/receipt/findTrackList": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
            status?: number;
        };
        res: ListRes<Schema.WarehouseReceipt>;
    };

    "/api/warehouse/receipt/delete": {
        params: {
            id: number
        };
        res: { failed: { number: string; reason: string }[] };
    };

    "/api/warehouse/receipt/downloadTemplate": {
        params?: never;
        res: { url: string; fileName: string };
    };

    "/api/warehouse/receipt/upload": {
        params: FormData;
        res: {
            failed: { masterWaybillNo: string, bigBagNo: string, reason: string }[];
            total: number;
            success: number;
        };
    };

    "/api/warehouse/receipt/getInfo": {
        params: { id: number };
        res: Schema.WarehouseReceipt;
    };

    "/api/warehouse/receipt/created": {
        params: Schema.WarehouseReceipt;
        res: never;
    };

    "/api/warehouse/receipt/edit": {
        params: Schema.WarehouseReceipt;
        res: never;
    };
}