import { ClientGridStore } from "@components";
import { makeAutoObservable, reaction } from "mobx";
import { loading, net } from "@infra";
import { VendorInfo } from "@features/baseinfo/vendor/vendor-info.type";

export class VendorInfoStore {
  loading = false;

  gridStore: ClientGridStore<VendorInfo>;

  selectedRowKeys: number[] = [];

  constructor(_options: unknown, gridStore: ClientGridStore<VendorInfo>) {
    makeAutoObservable(this);
    this.gridStore = gridStore;

    reaction(
      () => this.gridStore.rowData,
      () => {
        this.setSelectedRowKeys([]);
      }
    );
  }

  get selectedRows() {
    return this.gridStore.rowData.filter(r => this.selectedRowKeys.includes(r.id));
  }

  setSelectedRowKeys(keys: number[]) {
    this.selectedRowKeys = keys;
  }

  @loading()
  async delete(id: number) {
    await net.post("/api/warehouse/vendor/delete", { id: id });
    await this.gridStore.loadData();
  }
}