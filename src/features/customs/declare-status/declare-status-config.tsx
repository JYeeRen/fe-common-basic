import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsStatus, CustomsStatusQueryParams } from "./type";
import { find } from "lodash";
import { Options } from "@types";

export const getColumns = (params: {
  customsStatusTypes: Options;
  onRemarkSave: (params: {
    id: number;
    remark: string;
  }) => void;
}): TableColumnsType<CustomsStatus> => {
  const { customsStatusTypes, onRemarkSave } = params;
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
      key: "lhProviderName",
      dataIndex: "lhProviderName",
      title: t("干线服务商名称"),
    },
    {
      key: "customsStatus",
      dataIndex: "customsStatus",
      title: t("关务状态"),
      render: (value) => {
        return find(customsStatusTypes, { value })?.label;
      },
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
    { key: "customerName", dataIndex: "customerName", title: t("客户名称") },
    {
      key: "customsRemark",
      dataIndex: "customsRemark",
      title: t("备注"),
      width: 300,
      onCell: (record: CustomsStatus) => ({
        editable: true,
        value: record.customsRemark ?? "",
        onSave: (value: string) => onRemarkSave({ id: record.id, remark: value }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  ];
};

export const getRows = async (params: CustomsStatusQueryParams) => {
  return await net.post("/api/customsStatus/findList", params);
};
