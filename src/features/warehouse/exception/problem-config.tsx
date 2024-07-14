import {Options} from "@types";
import {ReceiptIssue, WarehouseProblemQueryParam} from "@features/warehouse/exception/type.ts";
import {OperationButtons, TableColumnsType} from "@components";
import {t} from "@locale";
import {find} from "lodash";
import {LinkOutlined, PictureOutlined} from "@ant-design/icons";
import {net} from "@infra";

export const getColumns = (params: {
    receiptStatusTypes: Options;
    receiptIssueStatusTypes: Options;
    operation: {
        showPic?: (record: ReceiptIssue) => void;
        link?: (record: ReceiptIssue) => void;
    };
}): TableColumnsType<ReceiptIssue> => {
    const {receiptStatusTypes, receiptIssueStatusTypes, operation} = params;
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
            key: "receiptTime",
            dataIndex: "receiptTime",
            title: t("入库时间"),
        },
        {
            key: "tailProviderName",
            dataIndex: "tailProviderName",
            title: t("尾程服务商名称")
        },
        {
            key: "palletCode",
            dataIndex: "palletCode",
            title: t("托盘码")
        },
        {
            key: "remark",
            dataIndex: "remark",
            title: t("备注")
        },
        {
            key: 'picture',
            title: t('面单照片'),
            width: 150,
            render: (__value, data) => {
                const operations = [
                    {
                        key: "showPic",
                        icon: <PictureOutlined/>,
                        onClick: () => operation.showPic?.(data),
                        label: t("查看照片"),
                    },
                ];

                if (data.waybillPhotoFile) {
                    return (<OperationButtons items={operations}/>);
                }
            },
        },
        {
            key: "receiptStatus",
            dataIndex: "receiptStatus",
            title: t("货物状态"),
            render: () => {
                return find(receiptStatusTypes, {value: 2})?.label;
            },
        },
        {
            key: "status",
            dataIndex: "status",
            title: t("处理状态"),
            render: (value) => {
                return find(receiptIssueStatusTypes, {value})?.label;
            },
        },
        {
            key: 'operation',
            title: t('操作'),
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

                if (data.status == 1) {
                    return (<OperationButtons items={operations}/>);
                }
            },
        },
    ];
}

export const getRows = async (params: WarehouseProblemQueryParam) => {
    return await net.post("/api/warehouse/receiptIssue/findList", params);
};