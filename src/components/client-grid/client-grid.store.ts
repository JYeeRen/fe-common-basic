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
}
