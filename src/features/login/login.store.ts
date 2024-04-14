import { makeAutoObservable } from "mobx";

class LoginStore {

  constructor() {
    makeAutoObservable(this);
  }

}

export default LoginStore;
