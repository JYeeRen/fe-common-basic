import {makeAutoObservable, reaction} from "mobx";
import {ClientGridStore} from "@components";
import {WarehouseReceipt} from "@features/warehouse/prediction/type.ts";

export class PredictionAddStore {
    loading = false;

    selectedRowKeys: number[] = [];

    gridStore: ClientGridStore<WarehouseReceipt>;

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

    get selectedRows() {
        return this.gridStore.rowData.filter(r => this.selectedRowKeys.includes(r.id));
    }

    setSelectedRowKeys(keys: number[]) {
        this.selectedRowKeys = keys;
    }
}