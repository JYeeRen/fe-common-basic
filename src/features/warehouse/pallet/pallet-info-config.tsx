import {OperationButtons, TableColumnsType} from "@components";
import {t} from "@locale";
import {PrinterOutlined} from "@ant-design/icons";
import {net} from "@infra";
import {PalletInfo, PalletInfoQueryParam} from "@features/warehouse/pallet/type.ts";

export const getColumns = (params: {
    operation: {
        print?: (record: PalletInfo) => void;
    };
}): TableColumnsType<PalletInfo> => {
    const {operation} = params;
    return [
        {
            key: "id",
            dataIndex: "id",
            title: t("序号"),
        },
        {
            key: "code",
            dataIndex: "code",
            title: t("托盘码")
        },
        {
            key: "date",
            dataIndex: "date",
            title: t("托盘码生成日期"),
        },
        {
            key: 'operation',
            title: t('打印条码'),
            width: 200,
            render: (__value, data) => {
                const operations = [
                    {
                        key: "edit",
                        icon: <PrinterOutlined/>,
                        onClick: () => operation.print?.(data),
                        label: t("打印"),
                    },
                ];

                return (<OperationButtons items={operations}/>);
            },
        },
    ];
}

export const getRows = async (params: PalletInfoQueryParam) => {
    return await net.post("/api/warehouse/pallet/findList", params);
};