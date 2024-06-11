import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { MawbStatus, StatusQueryParams } from "./type";

export const getColumns = (): TableColumnsType<MawbStatus> => {
  return [
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    {
      key: "customsStart",
      dataIndex: "customsStart",
      title: t("进口清关开始"),
    },
    {
      key: "customsRelease",
      dataIndex: "customsRelease",
      title: t("海关放行"),
    },
    {
      key: "customsFinished",
      dataIndex: "customsFinished",
      title: t("进口清关完成"),
    },
    {
      key: "customsException",
      dataIndex: "customsException",
      title: t("进口清关异常"),
    },
    {
      key: "customsInspection",
      dataIndex: "customsInspection",
      title: t("进口清关查验"),
    },
    {
      key: "transportHandover",
      dataIndex: "transportHandover",
      title: t("交接给末端配送服务商"),
    },
  ];
};

export const getRows = async (params: StatusQueryParams) => {
  return await net.post("/api/customsTrackLog/findMawbStatusList", params);
};
