import {makeAutoObservable} from "mobx";
import {ClientGridStore} from "@components";
import {
    ReceiptIssue,
    ReceiptIssueLink,
    WarehouseProblemDoLinkCreateQueryParam,
    WarehouseProblemDoLinkQueryParam
} from "@features/warehouse/exception/type.ts";
import {loading, net} from "@infra";

export class ProblemModalStore {
    loading = false;

    createModalVisible = false;

    issueData: ReceiptIssue | undefined;

    gridStore: ClientGridStore<ReceiptIssueLink>;

    constructor(_options: unknown, gridStore: ClientGridStore<ReceiptIssueLink>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }

    showCreateModal(issue: ReceiptIssue) {
        this.createModalVisible = true;
        this.issueData = issue;
    }

    hideCreateModal() {
        this.createModalVisible = false;
        this.issueData = undefined;
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