import { makeAutoObservable } from "mobx";
import { CustomITemsQueryParams } from "./types";
import { loading, net } from "@infra";

export class ClearanceOfGoodsStore {

  loading = false;
  uploadVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  showUploadModal() {
    this.uploadVisible = true;
  }

  hideUploadModal() {
    this.uploadVisible = false;
  }

  @loading()
  async export(queryParams: CustomITemsQueryParams = {}) {
    await net.download('/api/customsItem/export', queryParams, { timeout: 60 * 1000 * 5 });
  }

  @loading()
  async upload(formData: FormData) {
    return await net.upload('/api/customsItem/import', formData);
  }

  @loading()
  async downLoadTemplate() {
    await net.download('/api/customsItem/downloadTemplate', undefined, { timeout: 60 * 1000 * 5 });
  }
}