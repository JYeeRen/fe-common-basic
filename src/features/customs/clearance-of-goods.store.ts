import { makeAutoObservable } from "mobx";
import { CustomITemsQueryParams } from "./types";
import { loading, net } from "@infra";

export class ClearanceOfGoodsStore {

  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async export(queryParams: CustomITemsQueryParams = {}) {
    await net.download('/api/customsItem/export', queryParams, { timeout: 60 * 1000 * 5 });
  }
}