import { net } from "@infra";
import { makeAutoObservable } from "mobx";
import { AccountItem, QueryParams } from "./types";


export class AccountListStore {
  total = 0;
  rowData: AccountItem[] = [];

  queryParams: QueryParams = {
    page: 1,
    size: 50
  };

  constructor() {
    makeAutoObservable(this);
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
