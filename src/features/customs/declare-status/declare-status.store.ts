import { ClientGridStore } from "@components";
import { makeAutoObservable, reaction } from "mobx";
import { CustomsStatus } from "./type";
import { some } from "lodash";

export class BillOfLadingStore {
  loading = false;
  warning = false;

  gridStore: ClientGridStore<CustomsStatus>;

  constructor(_options: unknown, gridStore: ClientGridStore<CustomsStatus>) {
    makeAutoObservable(this);
    this.gridStore = gridStore;

    reaction(() => this.gridStore.rowData, this.checkWarning.bind(this));
  }

  checkWarning() {
    const warning = some(this.gridStore.rowData, { warning: true });
    this.setWarning(warning);
  }

  setWarning(warning: boolean) {
    this.warning = warning;
  }
}
