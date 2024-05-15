import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsTrack, QueryParams } from "./type";
import optionsService from "@services/options.service";
import { find } from "lodash";

export const getColumns = (): TableColumnsType<CustomsTrack> => {
  return [
    {
      key: "bigBagNo",
      dataIndex: "bigBagNo",
      title: t("袋号"),
    },
    {
      key: "providerOrderId",
      dataIndex: "providerOrderId",
      title: t("运单号"),
    },
    {
      key: "trackingNo",
      dataIndex: "trackingNo",
      title: t("尾程单号"),
    },
    {
      key: "declarationBillId",
      dataIndex: "declarationBillId",
      title: t("订单号"),
    },
    {
      key: "actionCode",
      dataIndex: "actionCode",
      title: t("轨迹名称"),
      render: (value) =>
        find(optionsService.actionCodeList, { value })?.label,
    },
    {
      key: "operateTime",
      dataIndex: "operateTime",
      title: t("轨迹时间"),
    },
    {
      key: "createdTime",
      dataIndex: "createdTime",
      title: t("录入时间"),
    },
    { key: "userName", dataIndex: "userName", title: t("录入人员") },
  ];
};

export const getRows = async (params: QueryParams) => {
  return await net.post("/api/customsTrack/findPackageList", params);
};
