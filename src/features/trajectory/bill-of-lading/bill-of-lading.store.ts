import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";
import { QueryParams } from "./type";

export class BillOfLadingStore {
  loading = false;
  uploadModalVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  showUploadModal() {
    this.uploadModalVisible = true;
  }

  hideUploadModal() {
    this.uploadModalVisible = false;
  }

  @loading()
  async downloadTemplate() {
    await net.download("/api/customsTrack/downloadTemplate");
  }

  @loading()
  async export(params: QueryParams) {
    await net.download("/api/customsTrack/exportMawbTrack", params);
  }

  @loading()
  async addMawbTrack(id: number, key: string, value: string) {
    const { failed } = await net.post("/api/customsTrack/addMawbTrack", {
      ids: [id],
      waybillStatusCode: key,
      operateTime: value,
    });
    return failed;
  }

  @loading()
  async checkMawbTrackFile(formData: FormData) {
    const res = await net.upload("/api/customsTrack/checkMawbTrackFile", formData);
    return res;
  }
}
