import { net } from "@infra";
import { t } from "@locale";
import {
  CustomTemplate,
  CustomTemplateListOperations,
  TemplateListQueryParams,
} from "./types";
import { OperationButtons, TableColumnsType } from "@components";
import {
  DeleteOutlined,
  EditOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import optionsService from "@services/options.service";
import { find } from "lodash";

export const getColumns = (
  operatons: CustomTemplateListOperations
): TableColumnsType<CustomTemplate> => {
  return [
    {
      key: "no",
      title: t("序号"),
      width: 80,
      render: (__vlaue, __record, index) => index + 1,
    },
    { key: "id", dataIndex: "id", title: t("模板编号") },
    { key: "name", dataIndex: "name", title: t("模板名称"), width: 180 },
    {
      key: "type",
      dataIndex: "type",
      title: t("模板类型"),
      width: 180,
      render: (value) =>
        find(optionsService.customTemplateTypes, { value })?.label,
    },
    {
      key: "active",
      dataIndex: "active",
      title: t("模板状态"),
      width: 130,
      render: (value) => (value ? t("启用") : t("停用")),
    },
    {
      key: "operation",
      title: t("操作"),
      render: (__value, data) => {
        return (
          <OperationButtons
            items={[
              {
                key: "view",
                icon: <EditOutlined />,
                onClick: () => operatons.view?.(data.id),
                label: t("查看"),
              },
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
            ]}
          />
        );
      },
    },
  ];
};
// export const getColumns = (): AgGridTypes.ColumnDefs<CustomTemplate> => {
//   return [
//     { colId: "no", headerName: t("序号"), type: "no" },
//     { field: "id", headerName: t("模板编号") },
//     { field: "name", headerName: t("模板名称") },
//     { field: "type", headerName: t("模板类型") },
//     {
//       field: "active",
//       headerName: t("模板状态"),
//       cellDataType: false,
//       type: "state",
//     },
//     { colId: "operation", headerName: t("操作") },
//   ];
// };

export const getRows = async (params: TemplateListQueryParams) => {
  const data = await net.post("/api/customsTemplate/findList", params);
  return data;
};
