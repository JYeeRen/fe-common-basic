import {WarehouseReceipt, WarehouseReceiptQueryParams} from "@features/warehouse/prediction/type.ts";
import {TableColumnsType} from "@components";
import {t} from "@locale";
import {net} from "@infra";

export const getColumns = (): TableColumnsType<WarehouseReceipt> => {
    return [
        {
            key: "masterWaybillNo",
            dataIndex: "masterWaybillNo",
            title: t("提单号"),
        },
        {
            key: "bigBagNo",
            dataIndex: "bigBagNo",
            title: t("袋号")
        },
    ];
}

export const getRows = async (params: WarehouseReceiptQueryParams) => {
    return await net.post("/api/warehouse/receipt/findList", params);
};