import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { Package, QueryParams } from "./type";
import { chain } from "lodash";

export const getColumns = (rows: Package[]): TableColumnsType<Package> => {
  return [
    {
      width: 60,
      key: "index",
      dataIndex: "index",
      title: t("序号"),
      render: (__v, __r, index) => index + 1,
    },
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
      filters: chain(rows).map('masterWaybillNo').uniq().compact().map(v => ({ text: v, value: v })).value(),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {
        return record.masterWaybillNo === value;
      },
    },
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
    }
  ];
};

export const getRows = async (params: QueryParams) => {
  return await net.post("/api/customsTrack/findAddPackageList", params);
};
