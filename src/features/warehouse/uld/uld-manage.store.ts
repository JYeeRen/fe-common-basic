import { ClientGridStore } from "@components";
import { UldInfo } from "@features/warehouse/uld/uld-manage.type.ts";
import { makeAutoObservable, reaction } from "mobx";
import { loading, net } from "@infra";

export class UldManageStore {
  loading = false;

  gridStore: ClientGridStore<UldInfo>;

  selectedRowKeys: number[] = [];

  constructor(_options: unknown, gridStore: ClientGridStore<UldInfo>) {
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
  async showInfo(id: number) {
    return await net.post("/api/warehouse/unitLoadDevice/downloadPhoto", { id });
  }

  @loading()
  async delete(ids: number[]) {
    await net.post("/api/warehouse/unitLoadDevice/delete", { ids });
    await this.gridStore.loadData();
  }
}