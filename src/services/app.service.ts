import { makeAutoObservable } from "mobx";
import { NavigateFunction } from "react-router-dom";

interface AppServiceParams {
  navigate: NavigateFunction;
}

class AppService {

  navigate?: NavigateFunction = undefined;
  activeTopNav: string = "";
  activeSideNav: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  init({ navigate }: AppServiceParams) {
    this.navigate = navigate;
  }

}

const appService = new AppService;

export default appService;