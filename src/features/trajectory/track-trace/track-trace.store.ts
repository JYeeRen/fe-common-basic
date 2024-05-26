import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";
import { CustomsTrackStatus } from "./type";

export class TrackTraceStore {
  loading = false;

  editingCell?: {
    title: string;
    value: string;
    key: string;
    record: CustomsTrackStatus;
  } = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setEditingCell(editingCell?: TrackTraceStore['editingCell']) {
    console.log('>>>>>>>', editingCell);
    this.editingCell = editingCell;
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

  @loading()
  async setPackageDelivered(id: number, tz: string, time: string) {
    const res = await net.post('/api/customsTrack/setPackageDelivered', {
      ids: [id],
      timeZone: tz,
      time: time
    })
    return res.failed;
  }

  @loading()
  async setPackagePickedUp(id: number, tz: string, time: string) {
    const res = await net.post('/api/customsTrack/setPackagePickedUp', {
      ids: [id],
      timeZone: tz,
      time: time
    })
    return res.failed;
  }

}