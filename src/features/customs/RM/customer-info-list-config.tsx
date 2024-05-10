import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { Customer, CustomerQueryParams } from "./type";

export const getColumns = (
): TableColumnsType<Customer> => {
  return [
    {
      key: "no",
      title: t("序号"),
      width: 80,
      render: (__vlaue, __record, index) => index + 1,
    },
    { key: "customerName", dataIndex: "customerName", title: t("客户名称") },
    { key: "productNameCn", dataIndex: "productNameCn", title: t("中文品名") },
    {
      key: "productName",
      dataIndex: "productName",
      title: t("英文品名"),
    },
    {
      key: "exportHsCode",
      dataIndex: "exportHsCode",
      title: t("出口 HS CODE"),
    },
    {
      key: "importHsCode",
      dataIndex: "importHsCode",
      title: t("进口 HS CODE"),
    },
  ];
};

export const getRows = async (params: CustomerQueryParams) => {
  return await net.post("/api/customsRisk/findList", params);
};
