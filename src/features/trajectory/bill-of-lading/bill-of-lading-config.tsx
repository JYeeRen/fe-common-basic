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
      key: "lhProviderName",
      dataIndex: "lhProviderName",
      title: t("干线服务商名称"),
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
      sorter: true,
    },
    {
      key: "etd",
      dataIndex: "etd",
      sorter: true,
      title: t("ETD"),
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.etd,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "etd",
              title: t("ETD"),
              value: record.etd,
              record
            }),
        } as any),
    },
    {
      key: "eta",
      dataIndex: "eta",
      title: t("ETA"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
      ({
        record,
        editable: true,
        value: record.ata,
        handleDoubleCick: () =>
        handleDoubleCick({
            key: "eta",
            title: t("ETA"),
            value: record.eta,
            record
          }),
      } as any),
    },
    {
      key: "atd",
      dataIndex: "atd",
      title: t("ATD"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
      ({
        record,
        editable: true,
        value: record.atd,
        handleDoubleCick: () =>
        handleDoubleCick({
            key: "atd",
            title: t("ATD"),
            value: record.atd,
            record
          }),
      } as any),
    },
    {
      key: "ata",
      dataIndex: "ata",
      title: t("ATA"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
      ({
        record,
        editable: true,
        value: record.ata,
        handleDoubleCick: () =>
        handleDoubleCick({
            key: "ata",
            title: t("ATA"),
            value: record.ata,
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
      key: "2",
      dataIndex: "customsSubmittedTime",
      title: t("数据提交海关"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.customsSubmittedTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "2",
              title: t("数据提交海关"),
              value: record.customsSubmittedTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "3",
      dataIndex: "customsAcceptedTime",
      title: t("海关接收数据"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.customsAcceptedTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "3",
              title: t("海关接收数据"),
              value: record.customsAcceptedTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "5",
      dataIndex: "customsReleaseTime",
      title: t("海关放行（整票放行）"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.customsReleaseTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "5",
              title: t("海关放行（整票放行）"),
              value: record.customsReleaseTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "1",
      dataIndex: "pickedUpTime",
      title: t("货物已提货"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.pickedUpTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "1",
              title: t("货物已提货"),
              value: record.pickedUpTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "6",
      dataIndex: "handedOverTime",
      title: t("货物交接尾程"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.handedOverTime,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "6",
              title: t("货物交接尾程"),
              value: record.handedOverTime,
              record
            }),
        } as any),
    },
    {
      width: 230,
      key: "4",
      dataIndex: "customsInspection",
      title: t("海关查验（整票查验）"),
      sorter: true,
      onCell: (record: CustomsTrack) =>
        ({
          record,
          editable: true,
          value: record.customsInspection,
          handleDoubleCick: () =>
          handleDoubleCick({
              key: "4",
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
