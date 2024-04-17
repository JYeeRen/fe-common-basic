import { GridColumn } from "@components";
import { net } from "@infra";

export const pageSize = 100;

export const getGridColumns = (): GridColumn[] => {
  return [
    {
      id: "name",
      title: "账号角色",
      width: 200,
    },
    {
      id: "linkedCount",
      title: "关联账号",
      width: 200,
    },
    {
      id: "active",
      title: "角色状态",
      width: 200,
    },
  ];
};

export const getData = async (page: number) => {
  return await net.post('/api/role/getRoles', { page, size: pageSize });
}