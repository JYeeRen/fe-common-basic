/* eslint-disable @typescript-eslint/no-explicit-any */
import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsTrack, QueryParams } from "./type";

type handleDoubleClick = (editingCell: {
  key: string;
  title: string;
  value: string;
  record: CustomsTrack;
}) => void;

export const getColumns = (
  handleDoubleCick: handleDoubleClick
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
      key: "ata",
      dataIndex: "ata",
      title: t("ATA"),
      onCell: (record: CustomsTrack) =>
      ({
        record,
        editable: true,
        value: record.customsSubmittedTime,
        handleDoubleCick: () =>
        handleDoubleCick({
            key: "ata",
            title: t("ATA"),
            value: record.customsSubmittedTime,
            record
          }),
      } as any),
    },
    {
      key: "atd",
      dataIndex: "atd",
      title: t("ATD"),
      onCell: (record: CustomsTrack) =>
      ({
        record,
        editable: true,
        value: record.customsSubmittedTime,
        handleDoubleCick: () =>
        handleDoubleCick({
            key: "atd",
            title: t("ATD"),
            value: record.customsSubmittedTime,
            record
          }),
      } as any),
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
          record,
          editable: true,
          value: record.customsSubmittedTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "customs_submitted",
              title: t("数据提交海关"),
              value: record.customsSubmittedTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "customsAcceptedTime",
      dataIndex: "customsAcceptedTime",
      title: t("海关接收数据"),
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.customsAcceptedTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "customs_accepted",
              title: t("海关接收数据"),
              value: record.customsAcceptedTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "customsReleaseTime",
      dataIndex: "customsReleaseTime",
      title: t("海关放行（整票放行）"),
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.customsReleaseTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "customs_release",
              title: t("海关放行（整票放行）"),
              value: record.customsReleaseTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "pickedUpTime",
      dataIndex: "pickedUpTime",
      title: t("货物已提货"),
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.pickedUpTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "picked_up",
              title: t("货物已提货"),
              value: record.pickedUpTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "handedOverTime",
      dataIndex: "handedOverTime",
      title: t("货物交接尾程"),
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.handedOverTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "handed_over",
              title: t("货物交接尾程"),
              value: record.handedOverTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "customsInspection",
      dataIndex: "customsInspection",
      title: t("海关查验（整票查验）"),
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.customsInspection,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "customs_inspection",
              title: t("海关查验（整票查验）"),
              value: record.customsInspection,
              record
            }),
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
