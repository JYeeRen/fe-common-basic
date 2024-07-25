import { net } from "@infra";
import { t } from "@locale";
import { QueryParams, WaybillStatistics } from "./waybill-statistics.types";
import { TableColumnsType } from "@components";
import optionsService from "@services/options.service";
import { find } from "lodash";

export const getColumns = (): TableColumnsType<WaybillStatistics> => {
  return [
    // {
    //   key: "no",
    //   title: t("序号"),
    //   width: 80,
    //   render: (__vlaue, __record, index) => index + 1,
    // },
    { key: "port", dataIndex: "port", title: t("落地港口2") },
    { key: "ata", dataIndex: "ata", title: t("ATA") },
    {
      key: "flightNumber",
      dataIndex: "flightNumber",
      title: t("航班号2"),
      render: (value) =>
        find(optionsService.customTemplateTypes, { value })?.label,
    },
    { key: "PMC", dataIndex: "PMC", title: t("PMC") },
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号3"),
    },
  ];
};
export const getSubColumns = (
  name: string
): TableColumnsType<WaybillStatistics> => {
  return [
    { key: "PCL", dataIndex: "PCL", title: `${name}/n${t("包裹数")}` },
    { key: "CTN", dataIndex: "CTN", title: `${name}/n${t("箱数")}` },
    { key: "WGT", dataIndex: "WGT", title: `${name}/n${t("总重量")}` },
  ];
};
export const getRows = async (params: QueryParams) => {
  const data = await net.post("/api/dataStatistics/findList", params);
  return data;
};
