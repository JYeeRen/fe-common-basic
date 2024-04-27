/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReactProps } from "ag-grid-react";

export interface CellRendererProps<TData = any> {
  value: unknown;
  data: TData;
}

export type AnyObject = Record<PropertyKey, any>;

export type ColumnDefs<T> = (Exclude<
  AgGridReactProps<T>["columnDefs"],
  null | undefined
>[number] & {
  cellRenderer?: (params: CellRendererProps<T>) => any;
})[];

export type OnGridReady<T> = Exclude<
  AgGridReactProps<T>["onGridReady"],
  undefined
>;

export type getRowsFunc<T> = (params: {
  page: number;
  size: number;
}) => Promise<{ list: T[] | null; total: number }>;

export interface AgGridProps<T extends AnyObject> {
  columns?: ColumnDefs<T>;
  pageSize?: number;
  useAsyncData: true;
  getTotalCount: () => Promise<number>;
  getRows: getRowsFunc<T>;
}
