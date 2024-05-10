import { makeAutoObservable } from "mobx";

export class BillOfLadingStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }
}