import { net } from "@infra";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { MawbStatus, StatusQueryParams } from "./type";

export const getColumns = (): TableColumnsType<MawbStatus> => {
  return [
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
    },
    {
      key: "imcustomsStartRate",
      dataIndex: "imcustomsStartRate",
      title: t("清关开始申报"),
      sorter: true
    },
    {
      key: "imcustomsFinishedRate",
      dataIndex: "imcustomsFinishedRate",
      title: t("清关海关放行"),
      sorter: true
    },
    {
      key: "importCustomsInboundRate",
      dataIndex: "importCustomsInboundRate",
      title: t("入清关行仓库"),
      sorter: true
    },
    {
      key: "imcustomsReadyforpickRate",
      dataIndex: "imcustomsReadyforpickRate",
      title: t("待交接尾程"),
      sorter: true
    },
    {
      key: "transportHandoverRate",
      dataIndex: "transportHandoverRate",
      title: t("尾程交接"),
      sorter: true
    },
    {
      key: "trucktransferHandoverRate",
      dataIndex: "trucktransferHandoverRate",
      title: t("尾程入仓"),
      sorter: true
    },
    {
      key: "imcustomsInspectionRate",
      dataIndex: "imcustomsInspectionRate",
      title: t("海关查验"),
      sorter: true
    },
    {
      key: "imcustomsExceptionRate",
      dataIndex: "imcustomsExceptionRate",
      title: t("清关异常"),
      sorter: true
    },
    {
      key: "importCustomsFailureRate",
      dataIndex: "importCustomsFailureRate",
      title: t("清关失败"),
      sorter: true
    },
  ];
};

export const getRows = async (params: StatusQueryParams) => {
  return await net.post("/api/customsTrackLog/findMawbStatusList", params);
};
