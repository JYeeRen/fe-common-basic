import type { ListRes } from "@infra";
import { AgGridReactProps } from "ag-grid-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CellRendererProps<TData = any> {
  value: unknown;
  data: TData;
}

export type AnyObject = Record<PropertyKey, any>;

export type ColumnDefs<T> = (Exclude<AgGridReactProps<T>["columnDefs"], null | undefined>[number] & {
  cellRenderer?: (params: CellRendererProps<T>) => any;
})[];

export type OnGridReady<T> = Exclude<AgGridReactProps<T>["onGridReady"], undefined>;

interface BaseProps<T extends AnyObject> {
  columns?: ColumnDefs<T>;
  pageSize?: number;
}

interface AgGridClientProps<T extends AnyObject> extends BaseProps<T> {
  useAsyncData?: false;
}

export interface AgGridServerProps<T extends AnyObject> extends BaseProps<T> {
  useAsyncData: true;
  getTotalCount: () => Promise<number>;
  getRows: (params: { page: number; size: number }) => Promise<ListRes<T>>;
}

export type AgGridProps<T extends AnyObject = AnyObject> = AgGridClientProps<T> | AgGridServerProps<T>;