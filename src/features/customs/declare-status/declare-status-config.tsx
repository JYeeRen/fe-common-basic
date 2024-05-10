import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsStatus, CustomsStatusQueryParams } from "./type";
import optionsService from "@services/options.service";
import { find } from "lodash";

export const getColumns = (): TableColumnsType<CustomsStatus> => {
  return [
    {
      key: "no",
      title: t("序号"),
      render: (__vlaue, __record, index) => index + 1,
    },
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    { key: "bigBagNo", dataIndex: "bigBagNo", title: t("袋号") },
    {
      key: "customsStatus",
      dataIndex: "customsStatus",
      title: t("关务状态"),
      render: (value) => {
        return find(optionsService.get("customsStatusTypes"), { value })?.label;
      },
    },
    {
      key: "masterWaybillNo1",
      dataIndex: "masterWaybillNo1",
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
    { key: "customerName", dataIndex: "customerName", title: t("客户名称") },
    {
      key: "masterWaybillNo1",
      dataIndex: "masterWaybillNo1",
      title: t("最新轨迹名称"),
    },
    {
      key: "customsRemark",
      dataIndex: "customsRemark",
      title: t("备注"),
      width: 300,
    },
  ];
};

export const getRows = async (params: CustomsStatusQueryParams) => {
  return await net.post("/api/customsStatus/findList", params);
};
