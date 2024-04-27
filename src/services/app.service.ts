import { makeAutoObservable } from "mobx";
import { NavigateFunction } from "react-router-dom";

interface AppServiceParams {
  navigate: NavigateFunction;
}

class AppService {

  loadingCount = 0;
  navigate?: NavigateFunction = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get loading() {
    return this.loadingCount > 0;
  }

  init({ navigate }: AppServiceParams) {
    this.navigate = navigate;
    this.loadingCount = 0;
  }

  setLoading(loading: boolean) {
    if (loading) return this.loadingCount += 1;
    return this.loadingCount = Math.max(0, this.loadingCount - 1);
  }

}

const appService = new AppService;

export default appService;