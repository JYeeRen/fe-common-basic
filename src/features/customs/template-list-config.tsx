import { AgGridTypes } from "@components";
import { net } from "@infra";
import { t } from "@locale";
import { TemplateListQueryParams } from "./types";

export const getColumns = (): AgGridTypes.ColumnDefs<any> => {
  return [
    { field: "id", headerName: t("ID") },
    { field: "id", headerName: t("ID") },
    { field: "id", headerName: t("ID") },
    { field: "id", headerName: t("ID") },
    { field: "id", headerName: t("ID") },
    { field: "id", headerName: t("ID") },
  ];
};

export const getRows = (params: TemplateListQueryParams) => {
  return net.post('/api/account/findAccounts', params);
};