import { makeAutoObservable, runInAction } from "mobx";
import { NavigateFunction } from "react-router-dom";
import localStorage from './localStorage';
import { net } from "@infra";

interface AppServiceParams {
  navigate: NavigateFunction;
}

class AppService {

  lang: 'en' | 'zh';
  loadingCount = 0;
  navigate?: NavigateFunction = undefined;

  permissionDict: Record<string, boolean> = {};

  constructor() {
    makeAutoObservable(this);
    this.lang = localStorage.getItem('lang') || 'zh';
  }

  get loading() {
    return this.loadingCount > 0;
  }

  setLang(lang: AppService['lang']) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    window.location.reload();
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

  async fetchUserInfo() {
    const userInfo = await net.post('/api/account/getUserInfo');
    const cur = localStorage.getItem('user');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localStorage.setItem('user', { ...cur, ...userInfo } as any);
    runInAction(() => {
      this.refreshPermission();
    });
  }

}

const appService = new AppService;

export default appService;