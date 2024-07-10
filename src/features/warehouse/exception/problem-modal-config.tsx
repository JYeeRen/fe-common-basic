import {Options} from "@types";
import {
    ReceiptIssueLink,
    WarehouseProblemLinkQueryParam,
} from "@features/warehouse/exception/type.ts";
import {OperationButtons, TableColumnsType} from "@components";
import {t} from "@locale";
import {LinkOutlined} from "@ant-design/icons";
import {find} from "lodash";
import {net} from "@infra";

export const getColumns = (params: {
    receiptStatusTypes: Options;
    operation: {
        link?: (record: ReceiptIssueLink) => void;
    };
}): TableColumnsType<ReceiptIssueLink> => {
    const {receiptStatusTypes, operation} = params;
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
            key: "tailProviderName",
            dataIndex: "tailProviderName",
            title: t("尾程服务商名称")
        },
        {
            key: "receiptStatus",
            dataIndex: "receiptStatus",
            title: t("货物状态"),
            render: (value) => {
                return find(receiptStatusTypes, {value})?.label;
            },
        },
        {
            key: 'operation',
            title: t('关联包裹'),
            width: 150,
            render: (__value, data) => {
                const operations = [
                    {
                        key: "link",
                        icon: <LinkOutlined/>,
                        onClick: () => operation.link?.(data),
                        label: t("关联包裹"),
                    },
                ];

                return (<OperationButtons items={operations}/>);
            },
        },
    ];
}

export const getRows = async (params: WarehouseProblemLinkQueryParam) => {
    return await net.post("/api/warehouse/receiptIssue/findLinkList", params);
};