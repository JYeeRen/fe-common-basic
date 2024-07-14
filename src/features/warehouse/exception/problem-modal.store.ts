import {makeAutoObservable} from "mobx";
import {ClientGridStore} from "@components";
import {
    ReceiptIssueLink,
    WarehouseProblemDoLinkCreateQueryParam,
    WarehouseProblemDoLinkQueryParam
} from "@features/warehouse/exception/type.ts";
import {loading, net} from "@infra";

export class ProblemModalStore {
    loading = false;

    createModalVisible = false;

    issueId = 0;

    gridStore: ClientGridStore<ReceiptIssueLink>;

    constructor(_options: unknown, gridStore: ClientGridStore<ReceiptIssueLink>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }

    showCreateModal(id: number) {
        this.createModalVisible = true;
        this.issueId = id;
    }

    hideCreateModal() {
        this.createModalVisible = false;
        this.issueId = 0;
    }

    @loading()
    async doLink(params: WarehouseProblemDoLinkQueryParam) {
        return await net.post("/api/warehouse/receiptIssue/link", params);
    }

    @loading()
    async doCreateAndLink(params: WarehouseProblemDoLinkCreateQueryParam) {
        await net.post("/api/warehouse/receiptIssue/createAndLink", params);
    }
}