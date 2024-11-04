import { TableColumnsType } from "@components";
import { t } from "@locale";
import { net } from "@infra";
import { PalletInfo, PalletInfoQueryParam } from "@features/warehouse/pallet/type.ts";

export const getColumns = (): TableColumnsType<PalletInfo> => {
  return [
    {
      key: "id",
      dataIndex: "id",
      title: t("序号"),
    },
    {
      key: "code",
      dataIndex: "code",
      title: t("托盘码"),
      sorter: true,
    },
    {
      key: "date",
      dataIndex: "date",
      title: t("托盘码生成日期"),
      sorter: true,
    },
  ];
}

export const getRows = async (params: PalletInfoQueryParam) => {
  return await net.post("/api/warehouse/pallet/findList", params);
};