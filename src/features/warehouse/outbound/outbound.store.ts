import {ClientGridStore} from "@components";
import {makeAutoObservable} from "mobx";
import {WarehouseOutbound} from "@features/warehouse/outbound/type.ts";
import {loading, net} from "@infra";

export class OutboundStore {
    loading = false;
    editModalVisible = false;
    currentSelectId = 0;

    gridStore: ClientGridStore<WarehouseOutbound>;

    constructor(_options: unknown, gridStore: ClientGridStore<WarehouseOutbound>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }

    showEditModal() {
        this.editModalVisible = true;
    }

    hideEditModal() {
        this.currentSelectId = 0;
        this.editModalVisible = false;
    }

    @loading()
    async editTime(formData: { id: number, receiptTime: string }) {
        return await net.post("/api/warehouse/order/editReceiptTime", formData);
    }
}