import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";
import { QueryParams } from "./waybill-statistics.types";

export class Store {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async export(params: QueryParams) {
    await net.download('/api/dataStatistics/export', params);
  }
}