import { TableColumnsType } from "@components";
import { net } from "@infra";
import { t } from "@locale";
import { Role } from "./types";

export const getColumns = (): TableColumnsType<Role> => {
  return [
    {
      key: "email",
      dataIndex: "email",
      title: t("收件邮箱"),
    }
  ];
};

export const getRows = async (params: { page: number; size: number }) => {
  return await net.post("/api/subscriptionEmail/findList", params);
};

export const getTotalCount = async () => {
  const { total } = await getRows({ page: 1, size: 1 });
  return total;
};
