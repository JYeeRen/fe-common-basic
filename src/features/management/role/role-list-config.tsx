import {
  DeleteOutlined,
  EditOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { AgGrid, AgGridTypes } from "@components";
import { net } from "@infra";
import { t } from "@locale";
import { Role } from "./types";

export const pageSize = 100;

interface Operations {
  view?: (id: number) => void;
  edit?: (id: number) => void;
  delete?: (id: number) => void;
}

export const getGridColumns = (operatons: Operations): AgGridTypes.ColumnDefs<Role> => {
  return [
    {
      field: "name",
      headerName: t("账号角色"),
      pinned: 'left',
      cellRenderer: AgGrid.renderer.loading,
    },
    {
      field: "linkedCount",
      headerName: t("关联账号"),
      pinned: 'left',
      valueFormatter: (params) => `${params.value}个`,
    },
    {
      field: "active",
      headerName: t("角色状态"),
      cellDataType: false,
      type: "state",
    },
    {
      colId: "operation",
      headerName: t("操作"),
      cellRenderer: AgGrid.renderer.operations([
        {
          key: "view",
          icon: <EditOutlined />,
          onClick: (data) => operatons.view?.(data.id),
          label: t("查看"),
        },
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
      ]),
    },
  ];
};

export const getRows = async (params: { page: number; size: number }) => {
  return await net.post("/api/role/getRoles", params);
};

export const getTotalCount = async () => {
  const { total } = await getRows({ page: 1, size: 1 });
  return total;
};
