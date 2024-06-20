import {ClientGridStore} from "@components";
import {makeAutoObservable} from "mobx";
import {WarehouseOutbound} from "@features/warehouse/outbound/type.ts";

export class OutboundStore {
    loading = false;

    gridStore: ClientGridStore<WarehouseOutbound>;

    constructor(_options: unknown, gridStore: ClientGridStore<WarehouseOutbound>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }
}