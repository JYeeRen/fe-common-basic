/* eslint-disable @typescript-eslint/no-explicit-any */
import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { CustomsTrackStatus, CustomsTrackStatusQueryParams } from "./type";
import optionsService from "@services/options.service";
import { find } from "lodash";

type handleDoubleClick = (editingCell: {
  key: string;
  title: string;
  value: string;
  record: CustomsTrackStatus;
}) => void;

export const getColumns = (
  handleDoubleCick: handleDoubleClick
): TableColumnsType<CustomsTrackStatus> => {
  return [
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    { key: "bigBagNo", dataIndex: "bigBagNo", title: t("袋号") },
    {
      key: "trackingNo",
      dataIndex: "trackingNo",
      title: t("尾程单号"),
    },
    {
      key: "providerOrderId",
      dataIndex: "providerOrderId",
      title: t("运单号"),
    },
    {
      key: "declarationBillId",
      dataIndex: "declarationBillId",
      title: t("订单号"),
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("最新轨迹名称"),
      render: (value) =>
        find(optionsService.customsTrackStatusTypes, { value })?.label,
    },
    {
      key: "pickedUpTime",
      dataIndex: "pickedUpTime",
      title: t("上网时间"),
      onCell: (record: CustomsTrackStatus) =>
        ({
          record,
          editable: true,
          value: record.pickedUpTime,
          handleDoubleCick: () =>
            handleDoubleCick({
              key: "pickedUpTime",
              title: t("上网时间"),
              value: record.pickedUpTime,
              record,
            }),
        } as any),
    },
    {
      key: "deliveredTime",
      dataIndex: "deliveredTime",
      title: t("签收时间"),
      onCell: (record: CustomsTrackStatus) =>
        ({
          record,
          editable: true,
          value: record.deliveredTime,
          handleDoubleCick: () =>
            handleDoubleCick({
              key: "deliveredTime",
              title: t("签收时间"),
              value: record.deliveredTime,
              record,
            }),
        } as any),
    },
    { key: "transportName", dataIndex: "transportName", title: t("航班号") },
    { key: "flightDate", dataIndex: "flightDate", title: t("航班日期") },
    {
      key: "ata",
      dataIndex: "ata",
      title: t("ATA"),
      onCell: (record: CustomsTrackStatus) =>
        ({
          record,
          editable: true,
          value: record.ata,
          handleDoubleCick: () =>
            handleDoubleCick({
              key: "ata",
              title: t("ATA"),
              value: record.ata,
              record,
            }),
        } as any),
    },
    {
      key: "atd",
      dataIndex: "atd",
      title: t("ATD"),
      onCell: (record: CustomsTrackStatus) =>
        ({
          record,
          editable: true,
          value: record.atd,
          handleDoubleCick: () =>
            handleDoubleCick({
              key: "atd",
              title: t("ATD"),
              value: record.atd,
              record,
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
  ];
};

export const getRows = async (params: CustomsTrackStatusQueryParams) => {
  return await net.post("/api/customsTrackStatus/findList", params);
};
