import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsTrack, QueryParams } from "./type";

export const getColumns = (): TableColumnsType<CustomsTrack> => {
  return [
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    {
      key: "transportName",
      dataIndex: "transportName",
      title: t("航班号"),
    },
    { key: "flightDate", dataIndex: "flightDate", title: t("航班日期") },
    { key: "etd", dataIndex: "etd", title: t("ETD") },
    { key: "eta", dataIndex: "eta", title: t("ETA") },
    {
      key: "departPortCode",
      dataIndex: "departPortCode",
      title: t("起飞港口"),
    },
    {
      key: "arrivePortCode",
      dataIndex: "arrivePortCode",
      title: t("落地港口"),
    },
    {
      key: "arrivePortCode",
      dataIndex: "arrivePortCode",
      title: t("数据提交海关"),
    },
    {
      key: "arrivePortCode",
      dataIndex: "arrivePortCode",
      title: t("海关接收数据"),
    },
    {
      key: "arrivePortCode",
      dataIndex: "arrivePortCode",
      title: t("海关放行（整票放行）"),
    },
    {
      key: "arrivePortCode",
      dataIndex: "arrivePortCode",
      title: t("货物已提货"),
    },
    {
      key: "arrivePortCode",
      dataIndex: "arrivePortCode",
      title: t("货物交接尾程"),
    },
    {
      key: "customsInspection",
      dataIndex: "customsInspection",
      title: t("海关查验（整票查验）"),
    },
    {
      key: "userName",
      dataIndex: "userName",
      title: t("操作人员"),
    },
  ];
};

export const getRows = async (params: QueryParams) => {
  return await net.post("/api/customsTrack/findMawbList", params);
};
