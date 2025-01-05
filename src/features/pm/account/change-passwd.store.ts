import { loading, net } from "@infra";
import { authProvider } from "@services/auth.service";
import { makeAutoObservable, runInAction } from "mobx";

export class ChangePasswdStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async changePasswd({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) {
    await net.post('/api/account/changePassword', { oldPassword, newPassword });
    runInAction(() => {
      authProvider.resetPwd = false;
    });
  }
}