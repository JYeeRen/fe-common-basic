import { ClientGridStore } from "@components";
import { makeAutoObservable, reaction } from "mobx";
import { CustomsDocument } from "./type";
import { some } from "lodash";
import { loading, net } from "@infra";
import dayjs from "dayjs";

export class DeclrationStore {
  loading = false;
  warning = false;

  gridStore: ClientGridStore<CustomsDocument>;

  selectedRowKeys: number[] = [];

  viewing: CustomsDocument | null = null;
  editing: CustomsDocument | null = null;

  creatingCustomDocs = false;
  creatingPrealertDocs = false;

  constructor(_options: unknown, gridStore: ClientGridStore<CustomsDocument>) {
    makeAutoObservable(this);
    this.gridStore = gridStore;

    reaction(
      () => this.gridStore.rowData,
      () => {
        this.checkWarning();
        this.setSelectedRowKeys([]);
      }
    );

    // reaction(
    //   () => this.creatingCustomDocs,
    //   () => this.creatingCustomDocs && this.gridStore.loadData()
    // )
    // reaction(
    //   () => this.creatingPrealertDocs,
    //   () => this.creatingPrealertDocs && this.gridStore.loadData()
    // )
  }

  get initiateDisabled() {
    return this.selectedRowKeys.length === 0;
  }

  get selectedRows() {
    return this.gridStore.rowData.filter((r) =>
      this.selectedRowKeys.includes(r.id)
    );
  }

  get selectedTakeOf() {
    const rows = this.selectedRows.filter(row => {
      return dayjs(row.atdIso || row.etdIso).isBefore(dayjs());
    });
    return rows;
  }

  get hasTakeOf() {
    return this.selectedTakeOf.length > 0;
  }

  setCreatingCustomDocs(creatingCustomDocs: boolean) {
    this.creatingCustomDocs = creatingCustomDocs;
  }

  setCreatingPrealertDocs(creatingPrealertDocs: boolean) {
    this.creatingPrealertDocs = creatingPrealertDocs;
  }

  checkWarning() {
    const warning = some(this.gridStore.rowData, { warning: true });
    this.setWarning(warning);
  }

  setWarning(warning: boolean) {
    this.warning = warning;
  }

  setSelectedRowKeys(keys: number[]) {
    this.selectedRowKeys = keys;
  }

  setViewing(record: CustomsDocument | null) {
    this.viewing = record;
  }

  setEditing(record: CustomsDocument | null) {
    this.editing = record;
  }

  @loading()
  async editRemark(params: { id: number; remark: string }) {
    await net.post("/api/customsStatus/editRemark", params);
    await this.gridStore.loadData();
  }

  @loading()
  async downloadSelectedCopyFile() {
    await net.download("/api/customsDocument/downloadCopyFile", {
      ids: this.selectedRowKeys,
    });
  }

  @loading()
  async createDocument() {
    await net.post("/api/customsStatus/createDocument", {
      ids: this.selectedRowKeys,
    });
    await this.gridStore.loadData();
  }

  @loading()
  async cancel(id: number) {
    await net.post("/api/customsDocument/cancelCreate", { ids: [id] });
    await this.gridStore.loadData();
  }

  @loading()
  async downloadCopyFile(id?: number) {
    if (!id) return;
    await net.download("/api/customsDocument/downloadCopyFile", { ids: [id] });
  }

  @loading()
  async downloadSelectedCustomsFile() {
    await net.download("/api/customsDocument/downloadCustomsFile", {
      ids: this.selectedRowKeys,
    });
  }

  @loading()
  async downloadSelectedPrealertFile() {
    await net.download("/api/customsDocument/downloadPrealert", {
      ids: this.selectedRowKeys,
    });
  }

  @loading()
  async downloadCustomsFile(id?: number) {
    if (!id) return;
    await net.download("/api/customsDocument/downloadCustomsFile", {
      ids: [id],
    });
  }
  @loading()
  async downloadTempCustomsFile() {
    await net.download("/api/customsDocument/downloadTempCustomsFile", {
      ids: this.selectedRowKeys,
    });
  }

  @loading()
  async downloadPrealert(id?: number) {
    if (!id) return;
    await net.download("/api/customsDocument/downloadPrealert", { ids: [id] });
  }

  @loading()
  async downloadTempPrealert() {
    await net.download("/api/customsDocument/downloadTempPrealert", {
      ids: this.selectedRowKeys,
    });
  }

  @loading()
  async createCustomFile(templateId: number) {
    const { failed } = await net.post(
      "/api/customsDocument/createTempCustomsFile",
      {
        ids: this.selectedRowKeys,
        templateId,
      }
    );
    return failed;
  }

  @loading()
  async createPrealert(templateId: number) {
    const { failed } = await net.post(
      "/api/customsDocument/createTempPrealert",
      {
        ids: this.selectedRowKeys,
        templateId,
      }
    );
    return failed;
  }

  @loading()
  async uploadCustomsFile(data: FormData) {
    const { failed } = await net.upload(
      "/api/customsDocument/uploadCustomsFile",
      data
    );
    return failed;
  }

  @loading()
  async uploadPrealert(data: FormData) {
    const { failed } = await net.upload(
      "/api/customsDocument/uploadPrealert",
      data
    );
    return failed;
  }

  @loading()
  async uploadCustomsFiles(formData: FormData, direct: boolean) {
    if (direct) {
      const { failed } = await net.post(
        "/api/customsDocument/useTempCustomsFile",
        { ids: this.selectedRowKeys }
      );
      return { failed, total: 0, success: 0 };
    }
    const { failed, total, success } = await net.upload(
      "/api/customsDocument/uploadCustomsFiles",
      formData
    );
    return { failed, total, success };
  }

  @loading()
  async uploadPrealerts(formData: FormData, direct: boolean) {
    if (direct) {
      const { failed } = await net.post(
        "/api/customsDocument/useTempPrealert",
        { ids: this.selectedRowKeys }
      );
      return { failed, total: 0, success: 0 };
    }
    const { failed, total, success } = await net.upload(
      "/api/customsDocument/uploadPrealerts",
      formData
    );
    return { failed, total, success };
  }
}
