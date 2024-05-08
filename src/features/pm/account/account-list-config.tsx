import {
  DeleteOutlined,
  RedoOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { OperationButtons, TableColumnsType } from "@components";
import { net } from "@infra";
import { t } from "@locale";
import { AccountItem, QueryParams } from "./types";

export const pageSize = 100;

interface Operations {
  resetPassword?: (id: number, username: string) => void;
  edit?: (id: number) => void;
  delete?: (id: number) => void;
}

export const getGridColumns = (
  operatons: Operations
): TableColumnsType<AccountItem> => {
  return [
    {
      key: "id",
      dataIndex: "id",
      title: t("ID"),
    },
    {
      key: "account",
      dataIndex: "account",
      title: t("用户账号"),
    },
    {
      key: "username",
      dataIndex: "username",
      title: t("用户名称"),
    },
    {
      key: "roleName",
      dataIndex: "roleName",
      title: t("账号角色"),
    },
    {
      key: "active",
      dataIndex: "active",
      title: t("账号状态"),
      render: (value) => (value ? t("启用") : t("停用")),
    },
    {
      key: "operation",
      title: t("操作"),
      render: (__value, data) => {
        return (
          <OperationButtons
            show={data?.scope !== 1}
            items={[
              {
                key: "edit",
                icon: <RightCircleOutlined />,
                onClick: () => operatons.edit?.(data.id),
                label: t("编辑"),
              },
              {
                key: "delete",
                icon: <DeleteOutlined />,
                onClick: () => operatons.delete?.(data.id),
                label: t("删除"),
              },
              {
                key: "reset",
                icon: <RedoOutlined />,
                onClick: () =>
                  operatons.resetPassword?.(data.id, data.username),
                label: t("重置初始密码"),
              },
            ]}
          />
        );
      },
    },
  ];
};

export const getRows = async (params: QueryParams) => {
  return await net.post("/api/account/findAccounts", params);
};

export const getTotalCount = async () => {
  const { total } = await getRows({ page: 1, size: 1 });
  return total;
};
