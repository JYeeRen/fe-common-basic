import { loading, net } from "@infra";
import optionsService from "@services/options.service";
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
  
  get templateTypeOptions() {
    return optionsService.get('customTemplateTypes');
  }

  get activeOptions() {
    return optionsService.get('actives');
  }

}
