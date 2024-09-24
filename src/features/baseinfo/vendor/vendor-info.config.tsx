import { VendorInfo } from "@features/baseinfo/vendor/vendor-info.type.ts";
import { OperationButtons, TableColumnsType } from "@components";
import { t } from "@locale";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { net } from "@infra";
import { VendorInfoQueryParam } from "@features/baseinfo/vendor/vendor-info.type.ts";

export const getColumns = (params: {
  operation: {
    edit?: (record: VendorInfo) => void;
    delete?: (record: VendorInfo) => void;
  };
}): TableColumnsType<VendorInfo> => {
  const { operation } = params;
  return [
    {
      key: "id",
      dataIndex: "id",
      title: t("序号"),
      sorter: true,
    },
    {
      key: "name",
      dataIndex: "name",
      title: t("公司名称"),
      sorter: true,
    },
    {
      key: "address",
      dataIndex: "address",
      title: t("地址"),
      sorter: true,
    },
    {
      key: "contactDetails",
      dataIndex: "contactDetails",
      title: t("联系方式"),
      sorter: true,
    },
    {
      key: "email",
      dataIndex: "email",
      title: t("邮箱"),
      sorter: true,
    },
    {
      key: "type",
      dataIndex: "type",
      title: t("公司类型"),
      sorter: true,
    },
    {
      key: "tailProviders",
      dataIndex: "tailProviders",
      title: t("尾程商子名称"),
      sorter: true,
    },
    {
      key: "portCode",
      dataIndex: "portCode",
      title: t("落地口岸"),
      sorter: true,
    },
    {
      key: "active",
      dataIndex: "active",
      title: t("启用状态"),
      sorter: true,
    },
    {
      key: "remarks",
      dataIndex: "remarks",
      title: t("备注"),
      sorter: true,
    },
    {
      key: 'operation',
      title: t('操作'),
      width: 200,
      render: (__value, data) => {
        const operations = [
          {
            key: "edit",
            icon: <EditOutlined />,
            onClick: () => operation.edit?.(data),
            label: t("编辑"),
          },
          {
            key: "cancel",
            icon: <DeleteOutlined />,
            onClick: () => operation.delete?.(data),
            label: t("删除"),
          },
        ];

        return (<OperationButtons items={operations} />);
      },
    },
  ];
}

export const getRows = async (params: VendorInfoQueryParam) => {
  return await net.post("/api/warehouse/vendor/findList", params);
};