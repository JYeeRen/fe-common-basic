import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";
import { AddPacakageTrackFormValues } from "./type";

export class PacageCustomsTrackStore {
  loading = false;

  createModalVisible = false;

  createParams: AddPacakageTrackFormValues = {
    ids: [],
    operateTime: '',
    timeZone: '',
    actionCode: '',
  };

  constructor() {
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
}