import { ClientGridStore } from "@components";
import { makeAutoObservable } from "mobx";
import { PacakgeChange } from "./type";
import { loading, net } from "@infra";
import { compact, flatten } from "lodash";

export class PackageChangeStore {
  loading = false;
  warning = false;

  gridStore: ClientGridStore<PacakgeChange>;

  pageSelected: Record<number, string[]> = {};
  // selectedRowKeys: string[] = [];

  constructor(_options: unknown, gridStore: ClientGridStore<PacakgeChange>) {
    makeAutoObservable(this);
    this.gridStore = gridStore;
  }

  resetPageSelect() {
    this.pageSelected = {};
  }

  get selectedRowKeys() {
    return flatten(Object.values(this.pageSelected));
  }

  setSelectedRowKeys(page: number, keys: string[]) {
    this.pageSelected[page] = keys;
  }

  @loading()
  async export() {
    const ids = compact(this.selectedRowKeys.map(k => {
      const kes = k.split(':')
      return { id: Number(kes[0]), changeTypeValue: Number(kes[1]) }
    } ));
    await net.download("/api/packageStatus/exportPackageLinkChanges", { ids });
  }
}
