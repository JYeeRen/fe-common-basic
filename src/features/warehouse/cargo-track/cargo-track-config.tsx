import {Options} from "@types";
import {TableColumnsType, Col} from "@components";
import {net} from "@infra";
import {t} from "@locale";
import {find} from "lodash";
import {WarehouseCargoTrackQueryParams, CargoTrack} from "@features/warehouse/prediction/type.ts";

export const getColumns = (params: {
    receiptStatusTypes: Options;
    deductionStatusTypes: Options;
}): TableColumnsType<CargoTrack> => {
    const {receiptStatusTypes, deductionStatusTypes} = params;
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
            key: "receiptStatus",
            dataIndex: "receiptStatus",
            title: t("货物状态"),
            render: (value) => {
                return find(receiptStatusTypes, {value})?.label;
            },
        },
        {
            key: "deductionStatus",
            dataIndex: "deductionStatus",
            title: t("扣货标记"),
            render: (value) => {
                return value == 0 ? "" : find(deductionStatusTypes, {value})?.label;
            },
        },
        {
            key: "receiptTime",
            dataIndex: "receiptTime",
            title: t("入库时间"),
        },
        {
            key: "loadTime",
            dataIndex: "loadTime",
            title: t("装车时间"),
        },
        {
            key: "outboundTime",
            dataIndex: "outboundTime",
            title: t("出库时间"),
        },
        {
            key: "tailProviderName",
            dataIndex: "tailProviderName",
            title: t("尾程服务商名称")
        },
        {
            key: "palletCode",
            dataIndex: "palletCode",
            title: t("托盘码"),
        },
        {
            key: "cabinetNo",
            dataIndex: "cabinetNo",
            title: t("车柜号"),
        },
        {
            key: "lockNo",
            dataIndex: "lockNo",
            title: t("锁号"),
        },
        {
            key: "companyName",
            dataIndex: "companyName",
            title: t("卡车公司名称"),
        },
        {
            key: "contact",
            dataIndex: "contact",
            title: t("卡车公司联系方式"),
        },
        {
            key: "direction",
            dataIndex: "direction",
            title: t("卡车方向"),
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
                        <div>{t("出库") + ": " + data.deductionUser}</div>
                    </Col>
                );
            },
        },
    ];
}

export const getRows = async (params: WarehouseCargoTrackQueryParams) => {
    return await net.post("/api/warehouse/track/findList", params);
};