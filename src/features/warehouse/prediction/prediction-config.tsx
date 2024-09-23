import {Options} from "@types";
import {OperationButtons, TableColumnsType} from "@components";
import {net} from "@infra";
import {t} from "@locale";
import {find} from "lodash";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {WarehouseReceipt, WarehouseReceiptQueryParams} from "@features/warehouse/prediction/type.ts";

export const getColumns = (params: {
    receiptStatusTypes: Options;
    operation: {
        edit?: (record: WarehouseReceipt) => void;
        delete?: (record: WarehouseReceipt) => void;
    };
}): TableColumnsType<WarehouseReceipt> => {
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
            title: t('操作'),
            width: 200,
            render: (__value, data) => {
                const operations = [
                    {
                        key: "edit",
                        icon: <EditOutlined/>,
                        onClick: () => operation.edit?.(data),
                        label: t("编辑"),
                    },
                    {
                        key: "cancel",
                        icon: <DeleteOutlined/>,
                        onClick: () => operation.delete?.(data),
                        label: t("删除"),
                    },
                ];

                return (<OperationButtons items={operations}/>);
            },
        },
    ];
}

export const getRows = async (params: WarehouseReceiptQueryParams) => {
    return await net.post("/api/warehouse/receipt/findList", params);
};