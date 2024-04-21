import { net } from "@infra";
import { makeAutoObservable } from "mobx";

export class RoleListStore {

  constructor() {
    makeAutoObservable(this);
  }

  async delteRole(id: number) {
    await net.post('/api/role/deleteRole', { id });
  }

}