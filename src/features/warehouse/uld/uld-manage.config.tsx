import { UldInfo, UldInfoQueryParam } from "@features/warehouse/uld/uld-manage.type.ts";
import { OperationButtons, TableColumnsType } from "@components";
import { t } from "@locale";
import { FileImageOutlined } from "@ant-design/icons";
import { net } from "@infra";

export const getColumns = (params: {
  operation: {
    show?: (record: UldInfo) => void;
  };
}): TableColumnsType<UldInfo> => {
  const { operation } = params;
  return [
    {
      key: "id",
      dataIndex: "id",
      title: t("序号"),
      sorter: true,
    },
    {
      key: "code",
      dataIndex: "code",
      title: t("ULD"),
      sorter: true,
    },
    {
      key: "creator",
      dataIndex: "creator",
      title: t("创建人"),
      sorter: true,
    },
    {
      key: "createTime",
      dataIndex: "createTime",
      title: t("创建时间"),
      sorter: true,
    },
    {
      key: 'operation',
      title: t('航空板照片'),
      width: 200,
      render: (__value, data) => {
        const operations = [
          {
            key: "show",
            icon: <FileImageOutlined/>,
            onClick: () => operation.show?.(data),
            label: t("查看"),
          },
        ];

        return (<OperationButtons items={operations}/>);
      },
    },
  ];
}

export const getRows = async (params: UldInfoQueryParam) => {
  return await net.post("/api/warehouse/unitLoadDevice/findList", params);
};