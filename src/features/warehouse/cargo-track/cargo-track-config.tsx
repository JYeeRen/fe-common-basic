import {Options} from "@types";
import {TableColumnsType} from "@components";
import {net} from "@infra";
import {t} from "@locale";
import {find} from "lodash";
import {WarehouseReceipt, WarehouseCargoTrackQueryParams} from "@features/warehouse/prediction/type.ts";

export const getColumns = (params: {
    receiptStatusTypes: Options;
}): TableColumnsType<WarehouseReceipt> => {
    const { receiptStatusTypes } = params;
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
        {
            key: "status",
            dataIndex: "status",
            title: t("货物状态"),
            render: (value) => {
                return find(receiptStatusTypes, { value })?.label;
            },
        },
        {
            key: "receiptTime",
            dataIndex: "receiptTime",
            title: t("入库时间"),
        },
        {
            key: "tailProviderName",
            dataIndex: "tailProviderName",
            title: t("尾程服务商名称")
        },
    ];
}

export const getRows = async (params: WarehouseCargoTrackQueryParams) => {
    return await net.post("/api/warehouse/receipt/findTrackList", params);
};