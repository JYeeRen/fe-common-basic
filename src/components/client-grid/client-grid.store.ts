import { makeAutoObservable, runInAction } from "mobx";
import { AnyObject } from "@types";
import { getRowsFunc } from "./types";
import { loading } from "@infra";
import { TableProps } from "antd";

export class ClientGridStore<T> {
  loading = false;

  pagination = true;
  page: number = 1;
  pageSize: number = 50;
  total: number = 0;
  rowData: T[] = [];
  private readonly getRows?: getRowsFunc<T> = undefined;
  queryParams: AnyObject = {};
  orderKeys: { key: string; order: string }[] = [];

  constructor(getRows?: getRowsFunc<T>, options?: { pagination?: boolean }) {
    this.pagination = options?.pagination ?? true;
    this.getRows = getRows;
    makeAutoObservable(this);

    // reaction(() => this.queryParams, this.loadData.bind(this));
  }

  setQueryParams(params?: AnyObject, autoQuery?: boolean) {
    this.queryParams = { ...params };
    this.page = 1;
    if (autoQuery !== false) {
      this.loadData();
    }
  }

  get params() {
    return this.queryParams;
  }

  @loading()
  async loadData() {
    if (!this.getRows) {
      return;
    }
    const { list, total } = await this.getRows({
      page: (this.pagination ? this.page : undefined) as number,
      size: (this.pagination ? this.pageSize : undefined) as number,
      orderKeys: this.orderKeys,
      ...this.queryParams,
    });
    runInAction(() => {
      this.total = total;
      this.rowData = list || [];
    });
  }

  onTableChange(page: number, pageSize: number) {
    this.page = page;
    this.pageSize = pageSize;
    this.loadData();
  }

  onCommonTableChange(...args: Parameters<Required<TableProps>["onChange"]>) {
    const [_pagination, _filer, sorter, _extra] = args;
    const orderKeys = [];
    if (sorter instanceof Array) {
      sorter.forEach((sort) => {
        if (sort.columnKey && sort.order) {
          orderKeys.push({
            key: sort.columnKey.toString(),
            order: sort.order ?? "",
          });
        }
      });
    } else {
      if (sorter.columnKey && sorter.order) {
        orderKeys.push({
          key: sorter.columnKey.toString(),
          order: sorter.order ?? "",
        });
      }
    }

    this.orderKeys = orderKeys;
    this.loadData();
  }
}
