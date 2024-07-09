import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { MawbCustomsTrackLog, MawbQueryParams } from "./type";
import optionsService from "@services/options.service";
import { find } from "lodash";

export const getColumns = (): TableColumnsType<MawbCustomsTrackLog> => {
  return [
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    {
      key: "waybillStatusCode",
      dataIndex: "waybillStatusCode",
      title: t("轨迹名称"),
      render: (value) =>
        find(optionsService.waybillTrackStatusList, { value })?.label,
    },
    {
      key: "operateTime",
      dataIndex: "operateTime",
      title: t("轨迹时间（原时区）"),
    },
    {
      key: "operateTimeCn",
      dataIndex: "operateTimeCn",
      title: t("轨迹时间（中国）"),
    },
    {
      key: "createdTimeCn",
      dataIndex: "createdTimeCn",
      title: t("录入时间（中国）"),
    },
    { key: "userName", dataIndex: "userName", title: t("录入人员") },
    {
      key: "uploadCompleted",
      dataIndex: "uploadCompleted",
      title: t("接收状态"),
      render: (value) => {
        let id = value ? 1 : 2;
        return find(optionsService.trackUploadStatusTypes, { value: id })
          ?.label;
      },
    },
  ];
};

export const getRows = async (params: MawbQueryParams) => {
  return await net.post("/api/customsTrackLog/findMawbList", params);
};
