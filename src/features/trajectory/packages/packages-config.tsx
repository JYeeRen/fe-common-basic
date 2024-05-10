import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsStatus, CustomsStatusQueryParams } from "./type";

export const getColumns = (
): TableColumnsType<CustomsStatus> => {
  return [
    { key: "masterWaybillNo", dataIndex: "masterWaybillNo", title: t("提单号") },
    { key: "bigBagNo", dataIndex: "bigBagNo", title: t("袋号") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("运单号") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("尾程单号") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("订单号") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("最新轨迹名称") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("上网时间") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("袋号") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("签收时间") },
    { key: "masterWaybillNo1", dataIndex: "masterWaybillNo1", title: t("航班号") },
    { key: "flightDate", dataIndex: "flightDate", title: t("航班日期") },
    { key: "etd", dataIndex: "etd", title: t("ATD") },
    { key: "eta", dataIndex: "eta", title: t("ATA") },
    { key: "departPortCode", dataIndex: "departPortCode", title: t("起飞港口") },
    { key: "arrivePortCode", dataIndex: "arrivePortCode", title: t("落地港口") },
  ];
};

export const getRows = async (params: CustomsStatusQueryParams) => {
  return await net.post("/api/customsStatus/findList", params);
};
