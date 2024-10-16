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

    "/api/warehouse/pallet/findList": {
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

    "/api/warehouse/pallet/downloadCodes": {
        params?: { ids: number[] };
        res: { url: string; fileName: string };
    };

    "/api/warehouse/pallet/create": {
        params: {
            date: string,
            count: number,
        };
        res: never;
    }

    "/api/warehouse/receiptIssue/findList": {
        params: ListParams & {
            number?: string;
            type?: number;
            receiptTime?: {
                zone: string;
                start: string;
                end: string;
            },
            status?: number;
            palletCode?: string;
            remark?: string;
        };
        res: ListRes<Schema.ReceiptIssue>;
    }

    "/api/warehouse/receiptIssue/findLinkList": {
        params: ListParams & {
            noList?: string[];
            noType?: number;
        };
        res: ListRes<Schema.ReceiptIssueLink>;
    }

    "/api/warehouse/receiptIssue/downloadWaybillPhoto": {
        params: {
            id: number;
        };
        res: { url: string; fileName: string };
    }

    "/api/warehouse/receiptIssue/link": {
        params: {
            receiptId: number,
            issueId: number,
        };
        res: never;
    }

    "/api/warehouse/receiptIssue/createAndLink": {
        params: {
            issueId: number,
            masterWaybillNo: string,
            bigBagNo: string,
            tailProviderName: string,
        };
        res: never;
    }

    "/api/warehouse/receipt/inbound": {
        params: {
            bigBagIds: number[],
            receiptTime: string,
            palletCode: string,
            tailProviderId: number,
        };
        res: {
            failed: { number: string, reason: string }[];
            total: number;
            success: number;
        };
    }

    "/api/warehouse/track/downloadPhoto": {
        params: {
            id: number;
        };
        res: { url: string; fileName: string };
    }

    "/api/warehouse/unitLoadDevice/findList": {
        params: ListParams & {
            codes?: string[];
        };
        res: ListRes<Schema.UldInfo>;
    }

    "/api/warehouse/unitLoadDevice/downloadPhoto": {
        params: {
            id: number;
        };
        res: { urlList: string[] };
    }

    "/api/warehouse/unitLoadDevice/delete": {
        params: {
            ids: number[];
        };
        res: never;
    }
}