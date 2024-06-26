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

    "/api/warehouse/track/findList": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
            receiptStatus?: number;
            deductionStatus?: number;
            receiptTime?: {
                zone: string;
                start: string;
                end: string;
            };
            outboundTime?: {
                zone: string;
                start: string;
                end: string;
            }
        };
        res: ListRes<Schema.CargoTrack>;
    };

    "/api/warehouse/track/export": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
            receiptStatus?: number;
            deductionStatus?: number;
            receiptTime?: {
                zone: string;
                start: string;
                end: string;
            };
            outboundTime?: {
                zone: string;
                start: string;
                end: string;
            }
        };
        res: { url: string; fileName: string };
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

    "/api/warehouse/deduction/findList": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
            receiptStatus?: number;
            deductionStatus?: number;
        };
        res: ListRes<Schema.Deduction>;
    };

    "/api/warehouse/deduction/findInitiateList": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
        };
        res: ListRes<Schema.DeductionInitiate>;
    };

    "/api/warehouse/deduction/cancel": {
        params: { id: number };
        res: never;
    };

    "/api/warehouse/deduction/initiate": {
        params: { ids: number[] };
        res: never;
    };

    "/api/warehouse/order/findList": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
            receiptTime?: {
                zone: string;
                start: string;
                end: string;
            }
        };
        res: ListRes<Schema.WarehouseOutbound>;
    }

    "/api/warehouse/order/editReceiptTime": {
        params: {
            id: number,
            receiptTime: string,
        };
        res: never;
    }

    "/api/warehouse/pallet_merge/findList": {
        params: ListParams & {
            codes?: string[];
            date?: {
                zone: string;
                start: string;
                end: string;
            }
        };
        res: ListRes<Schema.PalletInfo>;
    }

    "/api/warehouse/pallet_merge/downloadCodes": {
        params?: { ids: number[] };
        res: { url: string; fileName: string };
    };

    "/api/warehouse/pallet_merge/create": {
        params: {
            date: string,
            count: number,
        };
        res: never;
    }
}