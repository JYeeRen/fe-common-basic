import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { QueryParams, PacakgeChange } from "./type";

export const getColumns = (): TableColumnsType<PacakgeChange> => {
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
    { key: "change", dataIndex: "change", title: t("是否变动") },
    {
      key: "changeType",
      dataIndex: "changeType",
      title: t("变动方式"),
    },
    {
      key: "trackingNoList",
      dataIndex: "trackingNoList",
      title: t("发生变更的包裹尾程号"),
    },
    {
      key: "lhProviderName",
      dataIndex: "lhProviderName",
      title: t("干线服务商名称"),
    }
  ];
};

export const getRows = async (params: QueryParams) => {
  return await net.post("/api/packageStatus/findPackageLinkChanges", params);
};
