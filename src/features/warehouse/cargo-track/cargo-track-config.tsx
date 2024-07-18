import {Options} from "@types";
import {TableColumnsType, Col, OperationButtons} from "@components";
import {net} from "@infra";
import {t} from "@locale";
import {find} from "lodash";
import {WarehouseCargoTrackQueryParams, CargoTrack} from "@features/warehouse/prediction/type.ts";
import {PictureOutlined} from "@ant-design/icons";

export const getColumns = (params: {
    receiptStatusTypes: Options;
    deductionStatusTypes: Options;
    operation: {
        showPic?: (record: CargoTrack) => void;
    }
}): TableColumnsType<CargoTrack> => {
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
                return value == 0 ? "" : find(deductionStatusTypes, {value})?.label;
            },
        },
        {
            key: "receiptTime",
            dataIndex: "receiptTime",
            title: t("入库时间"),
            sorter: true,
        },
        {
            key: "loadTime",
            dataIndex: "loadTime",
            title: t("装车时间"),
            sorter: true,
        },
        {
            key: "outboundTime",
            dataIndex: "outboundTime",
            title: t("出库时间"),
            sorter: true,
        },
        {
            key: "tailProviderName",
            dataIndex: "tailProviderName",
            title: t("尾程服务商名称"),
            sorter: true,
        },
        {
            key: "palletCode",
            dataIndex: "palletCode",
            title: t("托盘码"),
            sorter: true,
        },
        {
            key: "cabinetNo",
            dataIndex: "cabinetNo",
            title: t("车柜号"),
            sorter: true,
        },
        {
            key: "lockNo",
            dataIndex: "lockNo",
            title: t("锁号"),
            sorter: true,
        },
        {
            key: "companyName",
            dataIndex: "companyName",
            title: t("卡车公司名称"),
            sorter: true,
        },
        {
            key: "driverName",
            dataIndex: "driverName",
            title: t("司机名称"),
            sorter: true,
        },
        {
            key: "driverContact",
            dataIndex: "driverContact",
            title: t("司机联系方式"),
            sorter: true,
        },
        {
            key: "bolCode",
            dataIndex: "bolCode",
            title: t("Bol码"),
            sorter: true,
        },
        {
            key: "direction",
            dataIndex: "direction",
            title: t("卡车方向"),
            sorter: true,
        },
        {
            key: 'picture',
            title: t('面单照片'),
            width: 150,
            sorter: true,
            render: (__value, data) => {
                const operations = [
                    {
                        key: "showPic",
                        icon: <PictureOutlined/>,
                        onClick: () => operation.showPic?.(data),
                        label: t("查看照片"),
                    },
                ];

                if (data.vehiclePhoto) {
                    return (<OperationButtons items={operations}/>);
                }
            },
        },
        {
            key: 'operation',
            title: t('操作人员'),
            width: 200,
            render: (__value, data) => {
                return (
                    <Col>
                        <div>{t("入库") + ": " + data.inboundUser}</div>
                        <div>{t("装车") + ": " + data.loadUser}</div>
                        <div>{t("扣货") + ": " + data.deductionUser}</div>
                    </Col>
                );
            },
        },
    ];
}

export const getRows = async (params: WarehouseCargoTrackQueryParams) => {
    return await net.post("/api/warehouse/track/findList", params);
};