import {Options} from "@types";
import {TableColumnsType} from "@components";
import {t} from "@locale";
import {find} from "lodash";
import {net} from "@infra";
import {DeductionInitiate, WarehouseDeductionQueryParam} from "@features/warehouse/exception/type.ts";

export const getColumns = (params: {
    receiptStatusTypes: Options;
}): TableColumnsType<DeductionInitiate> => {
    const {receiptStatusTypes} = params;
    return [
        {
            key: "id",
            dataIndex: "id",
            title: t("序号"),
        },
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
            key: "receiptStatus",
            dataIndex: "receiptStatus",
            title: t("货物状态"),
            render: (value) => {
                return find(receiptStatusTypes, {value})?.label;
            },
        },
    ];
}

export const getRows = async (params: WarehouseDeductionQueryParam) => {
    return await net.post("/api/warehouse/deduction/findInitiateList", params);
};