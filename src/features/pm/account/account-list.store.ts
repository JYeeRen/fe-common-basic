import { net } from "@infra";
import { makeAutoObservable } from "mobx";

export class AccountListStore {

  constructor() {
    makeAutoObservable(this);
  }

  async delteAccount(id: number) {
    await net.post('/api/account/deleteAccount', { id });
  }

  async resetPassword(id: number) {
    await net.post('/api/account/resetPassword', { id });
  }

}