import {Options} from "@types";
import {OperationButtons, TableColumnsType} from "@components";
import {t} from "@locale";
import {find} from "lodash";
import {EditOutlined} from "@ant-design/icons";
import {net} from "@infra";
import {WarehouseOutbound, WarehouseOutboundQueryParam} from "@features/warehouse/outbound/type.ts";

export const getColumns = (params: {
    receiptStatusTypes: Options;
    operation: {
        edit?: (record: WarehouseOutbound) => void;
    };
}): TableColumnsType<WarehouseOutbound> => {
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
            key: "receiptTime",
            dataIndex: "receiptTime",
            title: t("入库时间"),
            sorter: true,
        },
        {
            key: "tailProviderName",
            dataIndex: "tailProviderName",
            title: t("尾程服务商名称"),
            sorter: true,
        },
        {
            key: "ata",
            dataIndex: "ata",
            title: t("ATA"),   
            sorter: true,   
        },
        {
            key: "palletCode",
            dataIndex: "palletCode",
            title: t("托盘码"),
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
                        label: t("编辑入库时间"),
                    },
                ];

                return (<OperationButtons items={operations}/>);
            },
        },
    ];
}

export const getRows = async (params: WarehouseOutboundQueryParam) => {
    return await net.post("/api/warehouse/order/findList", params);
};