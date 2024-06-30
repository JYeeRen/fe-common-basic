import {ClientGridStore} from "@components";
import {DeductionInitiate} from "@features/warehouse/exception/type.ts";
import {makeAutoObservable, reaction} from "mobx";
import {loading, net} from "@infra";

export class DeductionModalStore {
    loading = false;

    gridStore: ClientGridStore<DeductionInitiate>;

    selectedRowKeys: number[] = [];

    constructor(_options: unknown, gridStore: ClientGridStore<DeductionInitiate>) {
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

    clearSelectedRows() {
        this.selectedRowKeys = [];
    }

    @loading()
    async initiateDeduction(formData: { ids: number[] }) {
        return await net.post("/api/warehouse/deduction/initiate", formData);
    }
}