import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";

export class TrackLogStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async uploadMawbTrack(ids: number[]) {
    await net.post('/api/customsTrackLog/uploadMawbTrack', { ids });
  }

  @loading()
  async uploadPackageTrack(ids: number[]) {
    await net.post('/api/customsTrackLog/uploadPackageTrack', { ids });
  }
}