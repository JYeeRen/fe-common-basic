import { net } from "@infra";
import { makeAutoObservable } from "mobx";

export class EmailStore {

  createVisible = false;
  setVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  showCreate() {
    this.createVisible = true;
  }

  hideCreate() {
    this.createVisible = false;
  }

  showSet() {
    this.setVisible = true;
  }

  hideSet() {
    this.setVisible = false;
  }


  async addEmail(email: string) {
    await net.post('/api/subscriptionEmail/add', { email });
  }

  async deleteEmails(ids: number[]) {
    await net.post('/api/subscriptionEmail/delete', { ids });
  }

  async setTypes(ids: number[], types: number[]) {
    await net.post('/api/subscriptionEmail/setTypes', { ids, types });
  }

}