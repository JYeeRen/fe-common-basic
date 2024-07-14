import {ClientGridStore} from "@components";
import {makeAutoObservable} from "mobx";
import {ReceiptIssue} from "@features/warehouse/exception/type.ts";
import {loading, net} from "@infra";

export class ProblemStore {
    loading = false;

    problemLinkModalVisible = false;

    problemLinkSelected = 0;

    gridStore: ClientGridStore<ReceiptIssue>;

    imageUrl = "error";

    imageVisible = false;

    constructor(_options: unknown, gridStore: ClientGridStore<ReceiptIssue>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;
    }

    showProblemLinkModal(id: number) {
        this.problemLinkModalVisible = true;
        this.problemLinkSelected = id;
    }

    hideProblemLinkModal() {
        this.problemLinkModalVisible = false;
        this.problemLinkSelected = 0;
    }

    setImageVisible(status: boolean) {
        this.imageVisible = status;
        if (!status)
            this.imageUrl = "error";
    }

    @loading()
    async getImageUrl(params: { id: number }) {
        return await net.post("/api/warehouse/receiptIssue/downloadWaybillPhoto", params);
    }
}