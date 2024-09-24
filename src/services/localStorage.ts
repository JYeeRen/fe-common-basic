import store from "store2";
import { User } from "./types";
import { Sources } from "@types";

interface LocalValues {
  lang: 'zh-CN' | 'en';
  authToken?: string;
  user?: User;
  "options.base"?: Sources["/api/option/getBase"]["res"];
  "options.roles"?: Sources["/api/option/getRoleNames"]["res"];
  "options.customsTemplates"?: Sources["/api/option/getCustomsTemplates"]["res"];
  "options.prealertTemplates"?: Sources["/api/option/getPrealertTemplates"]["res"];
  "options.permissions"?: Sources["/api/option/getPermissions"]["res"];
  "table.col.config"?: Record<string, string[]>;
}

class LocalStorage {
  values: Partial<LocalValues> = {};

  setItem<K extends keyof LocalValues>(key: K, value: LocalValues[K]) {
    this.values[key] = value;
    store.set(key, value);
  }

  getItem<K extends keyof LocalValues>(key: K): LocalValues[K] {
    return store.get(key);
  }

  setSideMenuOpenKeys(openKeys: string[]) {
    store.set(`${this.values.user?.userId}.side-menu.open-keys`, openKeys);
  }

  getSideMenuOpenKeys(): string[] {
    return store.get(`${this.values.user?.userId}.side-menu.open-keys`) || [];
  }
}

export default new LocalStorage();
