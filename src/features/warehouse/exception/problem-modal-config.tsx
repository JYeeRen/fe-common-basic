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
            sorter: true,
        },
        {
            key: "bigBagNo",
            dataIndex: "bigBagNo",
            title: t("袋号"),
            sorter: true,
        },
        {
            key: "ata",
            dataIndex: "ata",
            title: t("ATA"),      
            sorter: true,
        },
        {
            key: "tailProviderName",
            dataIndex: "tailProviderName",
            title: t("尾程服务商名称"),
            sorter: true,
        },
        {
            key: "arrivePortCode",
            dataIndex: "arrivePortCode",
            title: t("落地口岸"),
        },
        {
            key: "status",
            dataIndex: "status",
            title: t("货物状态"),
            sorter: true,
            render: (value) => {
                return find(receiptStatusTypes, {value})?.label;
            },
        },
        {
            key: 'operation',
            title: t('关联包裹'),
            width: 100,
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