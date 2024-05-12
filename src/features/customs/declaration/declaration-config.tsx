import { net } from "@infra";
import { t } from "@locale";
import { OperationButtons, TableColumnsType } from "@components";
import { CustomsDocument, CustomsDocumentQueryParams } from "./type";
import { find } from "lodash";
import { Options } from "@types";
import { EditOutlined, LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const getColumns = (params: {
  customsStatusTypes: Options;
  operation: {
    view?: (record: CustomsDocument) => void;
    edit?: (record: CustomsDocument) => void;
    cancel?: (record: CustomsDocument) => void;
  };
}): TableColumnsType<CustomsDocument> => {
  const { customsStatusTypes, operation } = params;
  return [
    {
      key: "no",
      title: t("序号"),
      render: (__vlaue, __record, index) => index + 1,
    },
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    { key: "bigBagNo", dataIndex: "bigBagNo", title: t("袋号") },
    {
      key: "customsStatus",
      dataIndex: "customsStatus",
      title: t("关务状态"),
      render: (value) => {
        return find(customsStatusTypes, { value })?.label;
      },
    },
    {
      key: "transportName",
      dataIndex: "transportName",
      title: t("航班号"),
    },
    { key: "flightDate", dataIndex: "flightDate", title: t("航班日期") },
    { key: "etd", dataIndex: "etd", title: t("ETD") },
    { key: "eta", dataIndex: "eta", title: t("ETA") },
    {
      key: "departPortCode",
      dataIndex: "departPortCode",
      title: t("起飞港口"),
    },
    {
      key: "arrivePortCode",
      dataIndex: "arrivePortCode",
      title: t("落地港口"),
    },
    { key: "customerName", dataIndex: "customerName", title: t("客户名称") },
    {
      key: "customsRemark",
      dataIndex: "customsRemark",
      title: t("备注"),
    },
    {
      key: 'operation',
      title: t('操作'),
      width: 380,
      render: (__value, data) => {
        const operations = [
          {
            key: "view",
            icon: <RightCircleOutlined />,
            onClick: () => operation.view?.(data),
            label: t("查看相关文件"),
          },
          {
            key: "edit",
            icon: <EditOutlined />,
            onClick: () => operation.edit?.(data),
            label: t("编辑"),
          },
          {
            key: "cancel",
            icon: <LeftCircleOutlined />,
            onClick: () => operation.cancel?.(data),
            label: t("取消制作"),
          },
        ];
        if (data.atd || data.etd) {
          if (dayjs(data.atd || data.etd).isBefore(dayjs())) {
            operations.splice(1, 1);
          }
        }
        
        return (
          <OperationButtons
            items={operations}
          />
        );
      },
    }
  ];
};

export const getRows = async (params: CustomsDocumentQueryParams) => {
  return await net.post("/api/customsDocument/findList", params);
};
