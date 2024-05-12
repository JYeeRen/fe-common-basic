import { ClientGridStore } from "@components";
import { makeAutoObservable, reaction } from "mobx";
import { CustomsStatus } from "./type";
import { some } from "lodash";
import { loading, net } from "@infra";

export class BillOfLadingStore {
  loading = false;
  warning = false;

  gridStore: ClientGridStore<CustomsStatus>;

  selectedRowKeys: number[] = [];

  constructor(_options: unknown, gridStore: ClientGridStore<CustomsStatus>) {
    makeAutoObservable(this);
    this.gridStore = gridStore;

    reaction(
      () => this.gridStore.rowData,
      () => {
        this.checkWarning();
        this.setSelectedRowKeys([]);
      }
    );
  }

  get initiateDisabled() {
    return this.selectedRowKeys.length === 0;
  }

  checkWarning() {
    const warning = some(this.gridStore.rowData, { warning: true });
    this.setWarning(warning);
  }

  setWarning(warning: boolean) {
    this.warning = warning;
  }

  setSelectedRowKeys(keys: number[]) {
    this.selectedRowKeys = keys;
  }

  @loading()
  async editRemark(params: { id: number; remark: string }) {
    await net.post("/api/customsStatus/editRemark", params);
    await this.gridStore.loadData();
  }

  @loading()
  async export() {
    await net.download("/api/customsStatus/export", this.gridStore.params);
  }

  @loading()
  async createDocument() {
    await net.post("/api/customsStatus/createDocument", {
      ids: this.selectedRowKeys,
    });
    await this.gridStore.loadData();
  }
}
