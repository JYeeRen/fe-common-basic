import { loading, net } from "@infra";
import { makeAutoObservable } from "mobx";

export class ChangePasswdStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async changePasswd({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) {
    console.log(oldPassword, newPassword)
    await net.post('/api/account/changePassword', { oldPassword, newPassword });
  }
}