import { net } from "@infra";
import { makeAutoObservable, runInAction, reaction } from "mobx";
import { AccountItem, QueryParams } from "./types";
import * as accountListConfig from "./account-list-config";


export class AccountListStore {
  total = 0;
  rowData: AccountItem[] = [];

  queryParams: QueryParams = {
    page: 1,
    size: 50
  };

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.queryParams,
      () => this.loadData()
    )
  }

  async loadData() {
    const { list, total } = await accountListConfig.getRows(this.queryParams);
    runInAction(() => {
      this.rowData = list;
      this.total = total;
    });
  }

  get pagination() {
    return {
      page: this.queryParams.page,
      size: this.queryParams.size,
      total: this.total,
    };
  }

  onQueryParamsChange(queryParams: QueryParams) {
    this.queryParams = { ...queryParams, page: 1 };
  }

  onTableChange(page: number, size: number) {
    this.queryParams.page = page;
    this.queryParams.size = size;
  }

  async delteAccount(id: number) {
    await net.post("/api/account/deleteAccount", { id });
  }

  async resetPassword(id: number) {
    await net.post("/api/account/resetPassword", { id });
  }
}
