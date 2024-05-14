import { makeAutoObservable } from "mobx";

export class TrackLogStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }
}