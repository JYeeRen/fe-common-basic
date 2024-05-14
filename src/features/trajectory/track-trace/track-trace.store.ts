import { makeAutoObservable } from "mobx";

export class TrackTraceStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }
}