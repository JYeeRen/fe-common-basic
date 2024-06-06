import {ClientGridStore} from "@components";
import {WarehouseReceipt} from "@features/warehouse/prediction/type.ts";
import {makeAutoObservable, reaction} from "mobx";

export class CargoTrackStore {
    loading = false;

    gridStore: ClientGridStore<WarehouseReceipt>;

    selectedRowKeys: number[] = [];

    constructor(_options: unknown, gridStore: ClientGridStore<WarehouseReceipt>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;

        reaction(
            () => this.gridStore.rowData,
            () => {
                this.setSelectedRowKeys([]);
            }
        );
    }

    setSelectedRowKeys(keys: number[]) {
        this.selectedRowKeys = keys;
    }
}