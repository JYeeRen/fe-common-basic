import { makeAutoObservable, reaction, runInAction } from "mobx";
import { AnyObject } from "@types";
import { getRowsFunc } from "./types";
import { loading } from "@infra";

export class ClientGridStore<T> {
  loading = false;

  pagination = true;
  page: number = 1;
  pageSize: number = 50;
  total: number = 0;
  rowData: T[] = [];
  private readonly getRows?: getRowsFunc<T> = undefined;
  queryParams: AnyObject = {};
  orderKeys: {key: string; order: string}[] = [];

  constructor(getRows?: getRowsFunc<T>, options?: { pagination?: boolean }) {
    this.pagination = options?.pagination ?? true;
    this.getRows = getRows;
    makeAutoObservable(this);

    reaction(() => this.queryParams, this.loadData.bind(this));
  }

  setQueryParams(params?: AnyObject) {
    this.queryParams = { ...params };
    this.page = 1;
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
      size: (this.pagination? this.pageSize : undefined) as number,
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

  onCommonTableChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log(pagination, filters, sorter, extra);
    this.orderKeys = [];
    if (sorter instanceof Array) {
      sorter.forEach((sort) => {
        this.orderKeys.push({key: sort.columnKey, order: sort.order ?? ''});
      });
    } else {
      this.orderKeys.push({key: sorter.columnKey, order: sorter.order ?? ''});
    }
    this.loadData();
  }
}
