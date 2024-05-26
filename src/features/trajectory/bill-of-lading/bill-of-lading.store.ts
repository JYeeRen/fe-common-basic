import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";
import { CustomsTrack, QueryParams } from "./type";

export class BillOfLadingStore {
  loading = false;
  uploadModalVisible = false;

  editingCell?: {
    title: string;
    value: string;
    key: string;
    record: CustomsTrack;
  } = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setEditingCell(editingCell?: BillOfLadingStore['editingCell']) {
    this.editingCell = editingCell;
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
  async addMawbTrack(id: number, key: string, value: string, tz: string) {
    const { failed } = await net.post("/api/customsTrack/addMawbTrack", {
      ids: [id],
      timeZone: tz,
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

  @loading()
  async uploadMawbTrack(formData: FormData) {
    return await net.upload("/api/customsTrack/uploadMawbTrack", formData);
  }

  @loading()
  async setMawbAta(id: number, tz: string, time: string) {
    const res = await net.post('/api/customsTrack/setMawbAta', {
      ids: [id],
      timeZone: tz,
      time: time
    })
    return res.failed;
  }

  @loading()
  async setMawbAtd(id: number, tz: string, time: string) {
    const res = await net.post('/api/customsTrack/setMawbAtd', {
      ids: [id],
      timeZone: tz,
      time: time
    })
    return res.failed;
  }
}
