import { net } from "@infra";
import { makeAutoObservable } from "mobx";

export class EmailStore {

  createVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  showCreate() {
    this.createVisible = true;
  }

  hideCreate() {
    this.createVisible = false;
  }

  async addEmail(email: string) {
    await net.post('/api/subscriptionEmail/add', { email });
  }

  async deleteEmails(ids: number[]) {
    await net.post('/api/subscriptionEmail/delete', { ids });
  }

}