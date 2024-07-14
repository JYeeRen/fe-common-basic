import {makeAutoObservable} from "mobx";
import {ClientGridStore} from "@components";
import {WarehouseInBoundQueryParams, WarehouseReceipt} from "@features/warehouse/prediction/type.ts";
import {loading, net} from "@infra";

export class PredictionAddStore {
    loading = false;

    gridStore: ClientGridStore<WarehouseReceipt>;

    constructor(_options: unknown, gridStore: ClientGridStore<WarehouseReceipt>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }

    @loading()
    async doInBound(params: WarehouseInBoundQueryParams) {
        return await net.post("/api/warehouse/receipt/inbound", params);
    }
}