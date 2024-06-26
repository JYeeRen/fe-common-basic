import {ClientGridStore} from "@components";
import {WarehouseReceipt} from "@features/warehouse/prediction/type.ts";
import {makeAutoObservable, reaction} from "mobx";
import {QueryParams} from "@features/trajectory/bill-of-lading/type.ts";
import {loading, net} from "@infra";

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

    @loading()
    async export(params: QueryParams) {
        await net.download("/api/warehouse/track/export", params);
    }
}