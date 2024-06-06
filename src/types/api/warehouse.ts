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
}