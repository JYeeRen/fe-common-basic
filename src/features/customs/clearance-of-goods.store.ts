import { makeAutoObservable } from "mobx";

export class ClearanceOfGoodsStore {
  constructor() {
    makeAutoObservable(this);
  }
}