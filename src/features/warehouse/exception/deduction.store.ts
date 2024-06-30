import {ClientGridStore} from "@components";
import {DeductionStruct} from "@features/warehouse/exception/type.ts";
import {makeAutoObservable} from "mobx";
import {loading, net} from "@infra";

export class DeductionStore {
    loading = false;

    gridStore: ClientGridStore<DeductionStruct>;

    initiateModalVisible = false;

    constructor(_options: unknown, gridStore: ClientGridStore<DeductionStruct>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }

    showInitiateModal() {
        this.initiateModalVisible = true;
    }

    hideInitiateModal() {
        this.initiateModalVisible = false;
    }

    @loading()
    async cancel(id: number) {
        await net.post("/api/warehouse/deduction/cancel", {id: id});
        await this.gridStore.loadData();
    }
}