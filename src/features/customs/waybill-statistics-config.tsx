import { net } from "@infra";
import { t } from "@locale";
import { QueryParams, WaybillStatistics } from "./waybill-statistics.types";
import { Modal, TableColumnsType } from "@components";
import { keyBy } from "lodash";

export const getColumns = (setPmc: (id: number, value: string) => void): TableColumnsType<WaybillStatistics> => {
  return [
    // {
    //   key: "no",
    //   title: t("序号"),
    //   width: 80,
    //   render: (__vlaue, __record, index) => index + 1,
    // },
    { key: "port", dataIndex: "port", title: t("落地港口2") },
    { key: "ata", dataIndex: "ata", title: t("ATA"), sorter: { multiple: 1 } },
    {
      key: "flightNumber",
      dataIndex: "flightNumber",
      title: t("航班号2")
    },
    {
      key: "PMC",
      dataIndex: "pmc",
      title: t("PMC"),
      onCell: (record: WaybillStatistics) => ({
        record,
        editable: true,
        value: record.pmc,
        onSave: (value: string) => setPmc(record.id, value),
      }) as any,
    },
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号3"),
    },
  ];
};
export const getSubColumns = (
  key: string,
  name: string
): TableColumnsType<WaybillStatistics> => {
  return [
    {
      key: `${name}_PCL`,
      dataIndex: ["tailProviders", key, "pcl"],
      title: `${name}${t("包裹数")}`,
    },
    {
      key: `${name}_CTN`,
      dataIndex: ["tailProviders", key, "ctn"],
      title: `${name}${t("箱数")}`,
    },
    {
      key: `${name}_WGT`,
      dataIndex: ["tailProviders", key, "wgt"],
      title: `${name}${t("总重量")}`,
    },
  ];
};
export const getRows = async (params: QueryParams) => {
  const data = await net.post("/api/dataStatistics/findList", params);
  const list = (data.list || []).map((row) => {
    return {
      ...row,
      tailProviders: keyBy(row.tailProviders, "id"),
    };
  });

  if (data.notFindList.length > 0) {
    Modal.error({
      title: t('未找到对应尾程商列表'),
      content: (
        <div>
          {data.notFindList.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      )
    });
  }

  return { ...data, list };
};
