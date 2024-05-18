import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsTrack, QueryParams } from "./type";

type HandleSave = (record: CustomsTrack, key: string, value: string) => Promise<boolean>;

export const getColumns = (
  onSave: HandleSave
): TableColumnsType<CustomsTrack> => {
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
    {
      key: "flightDate",
      dataIndex: "flightDate",
      title: t("航班日期"),
    },
    {
      key: "etd",
      dataIndex: "etd",
      title: t("ETD"),
    },
    {
      key: "eta",
      dataIndex: "eta",
      title: t("ETA"),
    },
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
      width: 230,
      key: "customsSubmittedTime",
      dataIndex: "customsSubmittedTime",
      title: t("数据提交海关"),
      onCell: (record: CustomsTrack) =>
        ({
          editable: true,
          value: record.customsSubmittedTime,
          onSave: async (value: string) =>
            await onSave(record, "customs_submitted", value),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
    },
    {
      width: 230,
      key: "customsAcceptedTime",
      dataIndex: "customsAcceptedTime",
      title: t("海关接收数据"),
      onCell: (record: CustomsTrack) =>
        ({
          editable: true,
          value: record.customsAcceptedTime,
          onSave: async (value: string) =>
            await onSave(record, "customs_accepted", value),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
    },
    {
      width: 230,
      key: "customsReleaseTime",
      dataIndex: "customsReleaseTime",
      title: t("海关放行（整票放行）"),
      onCell: (record: CustomsTrack) =>
        ({
          editable: true,
          value: record.customsReleaseTime,
          onSave: async (value: string) =>
            await onSave(record, "customs_release", value),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
    },
    {
      width: 230,
      key: "pickedUpTime",
      dataIndex: "pickedUpTime",
      title: t("货物已提货"),
      onCell: (record: CustomsTrack) =>
        ({
          editable: true,
          value: record.pickedUpTime,
          onSave: async (value: string) =>
            await onSave(record, "picked_up", value),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
    },
    {
      width: 230,
      key: "handedOverTime",
      dataIndex: "handedOverTime",
      title: t("货物交接尾程"),
      onCell: (record: CustomsTrack) =>
        ({
          editable: true,
          value: record.handedOverTime,
          onSave: async (value: string) =>
            await onSave(record, "handed_over", value),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
    },
    {
      width: 230,
      key: "customsInspection",
      dataIndex: "customsInspection",
      title: t("海关查验（整票查验）"),
      onCell: (record: CustomsTrack) =>
        ({
          editable: true,
          value: record.customsInspection,
          onSave: async (value: string) =>
            await onSave(record, "customs_inspection", value),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
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
