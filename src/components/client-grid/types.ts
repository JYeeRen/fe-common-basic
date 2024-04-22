/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject, ColumnDefs } from "@components/ag-grid/types";

export type { getRowsFunc } from "@components/ag-grid/types";

import { GridStore } from "./grid.store";

export interface ClientGridProps<T extends AnyObject> {
  columns?: ColumnDefs<T>;
  pageSize?: number;
  gridStore: GridStore<T>;
  useAsyncData?: false;
}
