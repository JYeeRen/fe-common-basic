import {
  DeleteOutlined,
  RedoOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { AgGrid, AgGridTypes } from "@components";
import { net } from "@infra";
import { t } from "@locale";
import { AccountItem } from "./types";

export const pageSize = 100;

interface Operations {
  resetPassword?: (id: number, username: string) => void;
  edit?: (id: number) => void;
  delete?: (id: number) => void;
}

export const getGridColumns = (
  operatons: Operations
): AgGridTypes.ColumnDefs<AccountItem> => {
  return [
    {
      field: "id",
      headerName: t("ID"),
      flex: 1,
    },
    {
      field: "account",
      headerName: t("用户账号"),
      flex: 1,
    },
    {
      field: "username",
      headerName: t("用户名称"),
      flex: 1,
    },
    {
      field: "roleName",
      headerName: t("账号角色"),
      flex: 1,
    },
    {
      field: "active",
      headerName: t("账号状态"),
      flex: 1,
      cellDataType: false,
      type: "state",
    },
    {
      colId: "operation",
      headerName: t("操作"),
      flex: 2,
      cellRenderer: AgGrid.renderer.operations(
        [
          {
            key: "edit",
            icon: <RightCircleOutlined />,
            onClick: (data) => operatons.edit?.(data.id),
            label: t("编辑"),
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            onClick: (data) => operatons.delete?.(data.id),
            label: t("删除"),
          },
          {
            key: "reset",
            icon: <RedoOutlined />,
            onClick: (data) => operatons.resetPassword?.(data.id, data.username),
            label: t("重置初始密码"),
          },
        ],
        (data) => data?.scope !== 1
      ),
    },
  ];
};

export const getRows = async (params: { page: number; size: number }) => {
  return await net.post("/api/account/findAccounts", {
    ...params,
    account: "",
    roleId: 0,
    activeType: true,
  });
};

export const getTotalCount = async () => {
  const { total } = await getRows({ page: 1, size: 1 });
  return total;
};
