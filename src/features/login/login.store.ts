import { makeAutoObservable } from "mobx";
import * as authService from "@services/auth.service";
import { ServerError } from "@/infra";

class LoginStore {

  tipVisible = false;
  tips = '用户名或密码不正确';

  constructor() {
    makeAutoObservable(this);
  }

  async login(username: string, password: string) {
    try {
      await authService.signIn({ username, password });
    } catch (err) {
      this.tipVisible = true;
      if (err instanceof ServerError) {
        this.tips = err.message;
      }
      console.error(err);
    }
  }


  hideTips() {
    this.tipVisible = false;
  }

}

export default LoginStore;