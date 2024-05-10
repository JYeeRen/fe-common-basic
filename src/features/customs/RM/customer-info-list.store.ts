import { makeAutoObservable } from "mobx";

export class CustomerInfoListStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }
}