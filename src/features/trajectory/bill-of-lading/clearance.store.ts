import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";

export class ClearanceStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async download(id: number) {
    await net.download("/api/customsDocument/downloadClearanceFile", { id });
  }

  @loading()
  async upload(formData: FormData) {
    const { failed } = await net.upload(
      "/api/customsDocument/uploadClearanceFiles",
      formData
    );
    return failed;
  }
}
