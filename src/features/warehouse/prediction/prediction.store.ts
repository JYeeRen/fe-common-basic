import {ClientGridStore} from "@components";
import {makeAutoObservable, reaction} from "mobx";
import {loading, net} from "@infra";
import {WarehouseReceipt} from "@features/warehouse/prediction/type.ts";

export class PredictionStore {
    loading = false;

    gridStore: ClientGridStore<WarehouseReceipt>;

    selectedRowKeys: number[] = [];

    editing: WarehouseReceipt | null = null;

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

    setEditing(record: WarehouseReceipt | null) {
        this.editing = record;
    }

    @loading()
    async delete(id: number) {
        await net.post("/api/warehouse/receipt/delete", { id: id });
        await this.gridStore.loadData();
    }
}