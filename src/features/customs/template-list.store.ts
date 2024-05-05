import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";

export class TemplateListStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async deleteTemplate(id: number) {
    await net.post("/api/customsTemplate/delete", { id });
  }
}
