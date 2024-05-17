import { makeAutoObservable } from "mobx";
import { NavigateFunction } from "react-router-dom";
import localStorage from './localStorage';

interface AppServiceParams {
  navigate: NavigateFunction;
}

class AppService {

  loadingCount = 0;
  navigate?: NavigateFunction = undefined;

  permissionDict: Record<string, boolean> = {};

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

  refreshPermission() {
    const { permissions = [] } = localStorage.getItem('user') || {};
    this.permissionDict = permissions.reduce((acc: Record<string, boolean>, cur) => (acc[cur] = true, acc), {});

  }

}

const appService = new AppService;

export default appService;