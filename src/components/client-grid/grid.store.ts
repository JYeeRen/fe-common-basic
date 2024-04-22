import { makeAutoObservable, runInAction } from "mobx";
import { getRowsFunc } from "./types";

export class GridStore<T> {

  page: number = 1;
  pageSize: number = 50;
  total: number = 0;
  rowData: T[] = [];

  getRows: getRowsFunc<T>;

  constructor(getRows: getRowsFunc<T>) {
    this.getRows = getRows;
    makeAutoObservable(this, { rowData: false });
  }

  async loadData() {
    const { list, total } = await this.getRows({ page: this.page, size: this.pageSize });
    runInAction(() => {
      this.total = total;
      this.rowData = list;
    });
  }

  onTableChange(page: number, pageSize: number) {
    this.page = page;
    this.pageSize = pageSize;
    this.loadData();
  }

}
