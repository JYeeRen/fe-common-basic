import {ClientGridStore} from "@components";
import {makeAutoObservable, reaction} from "mobx";
import {PalletInfo} from "@features/warehouse/pallet/type.ts";

export class PalletInfoStore {
    loading = false;

    gridStore: ClientGridStore<PalletInfo>;

    selectedRowKeys: number[] = [];

    constructor(_options: unknown, gridStore: ClientGridStore<PalletInfo>) {
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
}