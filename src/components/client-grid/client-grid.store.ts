import { makeAutoObservable, reaction, runInAction } from "mobx";
import { AnyObject } from "@types";
import { getRowsFunc } from "./types";

export class ClientGridStore<T> {

  page: number = 1;
  pageSize: number = 50;
  total: number = 0;
  rowData: T[] = [];
  private readonly getRows?: getRowsFunc<T> = undefined;
  private queryParams: AnyObject = {};

  constructor(getRows?: getRowsFunc<T>) {
    this.getRows = getRows;
    makeAutoObservable(this);

    reaction(() => this.queryParams, this.loadData.bind(this));
  }

  setQueryParams(params?: AnyObject) {
    this.queryParams = params ?? {};
    this.page = 1;
  }

  async loadData() {
    if (!this.getRows) {
      return;
    }
    const { list, total } = await this.getRows({
        page: this.page,
        size: this.pageSize,
        ...this.queryParams
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
