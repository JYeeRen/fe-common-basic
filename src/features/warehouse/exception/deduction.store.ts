import {ClientGridStore} from "@components";
import {DeductionStruct} from "@features/warehouse/exception/type.ts";
import {makeAutoObservable} from "mobx";

export class DeductionStore {
    loading = false;

    gridStore: ClientGridStore<DeductionStruct>;

    constructor(_options: unknown, gridStore: ClientGridStore<DeductionStruct>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }
}