import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";
import { AddPacakageTrackFormValues, CustomsTrack, QueryParams } from "./type";
import { ClientGridStore } from "@components";

export class PacageCustomsTrackStore {
  loading = false;

  createModalVisible = false;
  gridStore: ClientGridStore<CustomsTrack>;

  createParams: AddPacakageTrackFormValues = {
    ids: [],
    operateTime: '',
    timeZone: '',
    actionCode: '',
  };

  constructor(_: unknown, gridStore: ClientGridStore<CustomsTrack>) {
    this.gridStore = gridStore;
    makeAutoObservable(this);
  }

  toogleModalVisible() {
    this.createModalVisible = !this.createModalVisible;
    if (this.createModalVisible) {
      this.createParams = {
        ids: [],
        operateTime: '',
        timeZone: '',
        actionCode: '',
      };
    }
  }

  updateCreateParams(params: Partial<AddPacakageTrackFormValues>) {
    this.createParams = {
      ...this.createParams,
      ...params
    };
  }

  @loading()
  async addPackageTrack(params: AddPacakageTrackFormValues) {
    const { failed } =await net.post('/api/customsTrack/addPackageTrack', params);
    return failed;
  }

  @loading()
  async export(params: QueryParams) {
    await net.download("/api/customsTrack/exportPackageTrack", params);
  }
}