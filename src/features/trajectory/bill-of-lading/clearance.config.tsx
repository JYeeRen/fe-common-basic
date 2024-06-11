/* eslint-disable @typescript-eslint/no-explicit-any */
import { net } from "@infra";
import { t } from "@locale";
import { OperationButtons, TableColumnsType } from "@components";
import { Clearance, QueryParams } from "./clearance.type";
import { CloudDownloadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import optionsService from "@services/options.service";
import { find } from "lodash";

interface Operation {
  download: (id: number) => void;
  upload: (id: number) => void;
}

export const getColumns = (operatons: Operation): TableColumnsType<Clearance> => {
  return [
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    {
      key: "nextProviderNames",
      dataIndex: "nextProviderNames",
      title: t("尾程服务商"),
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("回传状态"),
      render: (value) =>
        find(optionsService.clearanceFileStatusTypes, { value })?.label,
    },
    {
      key: "etd",
      dataIndex: "etd",
      title: t("POD回传"),
      render: (__value, data) => {
        return (
          <OperationButtons
            items={[
              {
                key: "download",
                icon: <CloudDownloadOutlined />,
                onClick: () => operatons.download?.(data.id),
                label: t("文件下载"),
                disabled: data.status === 1
              },
              {
                key: "upload",
                icon: <CloudUploadOutlined />,
                onClick: () => operatons.upload?.(data.id),
                label: t("文件上传"),
              },
            ]}
          />
        );
      },
    },
  ];
};

export const getRows = async (params: QueryParams) => {
  return await net.post("/api/customsDocument/findClearanceList", params);
};
