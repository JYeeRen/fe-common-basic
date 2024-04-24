import { makeAutoObservable } from "mobx";
import * as authService from "@services/auth.service";

class LoginStore {

  tipVisible = false;
  tips = '用户名或密码不正确';

  constructor() {
    makeAutoObservable(this);
  }

  async login(account: string, password: string) {
      await authService.signin({ account, password });
  }


  hideTips() {
    this.tipVisible = false;
  }

}

export default LoginStore;
