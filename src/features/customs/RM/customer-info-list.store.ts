import { makeAutoObservable } from "mobx";
import { CustomerQueryParams } from "./type";
import { loading, net } from "@infra";

export class CustomerInfoListStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async export(params: CustomerQueryParams) {
    await net.download("/api/customsRisk/export", params);
  }
}