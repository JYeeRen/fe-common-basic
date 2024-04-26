import { AnyObject, ColumnDefs } from "@components/ag-grid/types";

import { getRowsFunc } from "@components/ag-grid/types";

export type { getRowsFunc } from "@components/ag-grid/types";

export interface ClientGridProps<T extends AnyObject> {
  queryParams?: AnyObject;
  columns?: ColumnDefs<T>;
  getRows: getRowsFunc<T>;
}
