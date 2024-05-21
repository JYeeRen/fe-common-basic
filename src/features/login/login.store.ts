import { makeAutoObservable } from "mobx";
import * as authService from "@services/auth.service";
import { t } from "@locale";
import appService from "@services/app.service";

class LoginStore {

  tipVisible = false;
  tips = t('用户名或密码不正确');

  constructor() {
    makeAutoObservable(this);
  }

  async login(account: string, password: string) {
    await authService.signin({ account, password });
    appService.refreshPermission();
  }


  hideTips() {
    this.tipVisible = false;
  }

}

export default LoginStore;
