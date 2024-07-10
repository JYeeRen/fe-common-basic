import {ClientGridStore} from "@components";
import {makeAutoObservable} from "mobx";
import {ReceiptIssue} from "@features/warehouse/exception/type.ts";

export class ProblemStore {
    loading = false;

    gridStore: ClientGridStore<ReceiptIssue>;

    constructor(_options: unknown, gridStore: ClientGridStore<ReceiptIssue>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }
}