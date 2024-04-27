import { makeAutoObservable } from "mobx";

export class TemplateListStore {
  constructor() {
    makeAutoObservable(this);
  }
}