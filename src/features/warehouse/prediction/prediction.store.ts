import {ClientGridStore} from "@components";
import {makeAutoObservable, reaction} from "mobx";
import {loading, net} from "@infra";
import {WarehouseReceipt} from "@features/warehouse/prediction/type.ts";

export class PredictionStore {
    loading = false;
    uploadModalVisible = false;

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

    showUploadModal() {
        this.uploadModalVisible = true;
    }

    hideUploadModal() {
        this.uploadModalVisible = false;
    }

    @loading()
    async delete(id: number) {
        await net.post("/api/warehouse/receipt/delete", { id: id });
        await this.gridStore.loadData();
    }

    @loading()
    async downloadTemplate() {
        await net.download("/api/warehouse/receipt/downloadTemplate");
    }

    @loading()
    async uploadTemplate(formData: FormData) {
        return await net.upload("/api/warehouse/receipt/upload", formData);
    }
}