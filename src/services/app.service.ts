import { makeAutoObservable } from "mobx";
import { NavigateFunction } from "react-router-dom";

interface AppServiceParams {
  navigate: NavigateFunction;
}

class AppService {

  navigate?: NavigateFunction = undefined;
  topnav = '';
  sidenav = '';
  opensidenav: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  init({ navigate }: AppServiceParams) {
    this.navigate = navigate;
  }

  setNav(topnav: string, sidenav: string, opensidenav?: string[]) {
    this.topnav = topnav;
    this.sidenav = sidenav;
    this.opensidenav = this.opensidenav || opensidenav;
  }

}

const appService = new AppService;

export default appService;