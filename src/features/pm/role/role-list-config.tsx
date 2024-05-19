import {
  DeleteOutlined,
  EditOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { Button, TableColumnsType } from "@components";
import { net } from "@infra";
import { t } from "@locale";
import { Role } from "./types";

export const pageSize = 100;

interface Operations {
  view?: (id: number) => void;
  edit?: (id: number) => void;
  delete?: (id: number) => void;
}

export const getColumns = (operatons: Operations): TableColumnsType<Role> => {
  return [
    {
      key: "name",
      dataIndex: "name",
      title: t("账号角色"),
    },
    {
      key: "linkedCount",
      dataIndex: "linkedCount",
      title: t("关联账号"),
      render: (value) => t('{{n}}个', { n: value }),
    },
    {
      key: "active",
      dataIndex: "active",
      title: t("角色状态"),
      render: (value) => (value ? t("启用") : t("停用")),
    },
    {
      key: "operation",
      title: t("操作"),
      render: (__value, data) => {
        return [
          {
            key: "view",
            icon: <EditOutlined />,
            onClick: (data: Role) => operatons.view?.(data.id),
            label: t("查看"),
          },
          {
            key: "edit",
            icon: <RightCircleOutlined />,
            onClick: (data: Role) => operatons.edit?.(data.id),
            label: t("编辑"),
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            onClick: (data: Role) => operatons.delete?.(data.id),
            label: t("删除"),
          },
        ].map(({ key, icon, onClick, label }) => (
          <Button
            key={key}
            type="link"
            icon={icon}
            onClick={() => onClick(data)}
          >
            {label}
          </Button>
        ));
      },
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
