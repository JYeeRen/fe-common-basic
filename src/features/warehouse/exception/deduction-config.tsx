import {Options} from "@types";
import {OperationButtons, TableColumnsType} from "@components";
import {t} from "@locale";
import {find} from "lodash";
import {net} from "@infra";
import {DeductionStruct, WarehouseDeductionQueryParam} from "@features/warehouse/exception/type.ts";
import {DeleteOutlined} from "@ant-design/icons";

export const getColumns = (params: {
    receiptStatusTypes: Options;
    deductionStatusTypes: Options;
    operation: {
        revert?: (record: DeductionStruct) => void;
    };
}): TableColumnsType<DeductionStruct> => {
    const {receiptStatusTypes, deductionStatusTypes, operation} = params;
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
            key: "receiptStatus",
            dataIndex: "receiptStatus",
            title: t("货物状态"),
            sorter: true,
            render: (value) => {
                return find(receiptStatusTypes, {value})?.label;
            },
        },
        {
            key: "deductionStatus",
            dataIndex: "deductionStatus",
            title: t("扣货标记"),
            sorter: true,
            render: (value) => {
                return find(deductionStatusTypes, {value})?.label;
            },
        },
        {
            key: "deductionOperator",
            dataIndex: "deductionOperator",
            title: t("操作人员"),
            sorter: true,
        },
        {
            key: "deductionTime",
            dataIndex: "deductionTime",
            title: t("操作时间"),
            sorter: true,
        },
        {
            key: 'operation',
            title: t('操作'),
            width: 200,
            render: (__value, data) => {
                const operations = [
                    {
                        key: "edit",
                        icon: <DeleteOutlined/>,
                        onClick: () => operation.revert?.(data),
                        label: t("撤销扣货指令"),
                    },
                ];

                if (data.deductionStatus != 3) {
                    return (<OperationButtons items={operations}/>);
                }
            },
        },
    ];
}

export const getRows = async (params: WarehouseDeductionQueryParam) => {
    return await net.post("/api/warehouse/deduction/findList", params);
};