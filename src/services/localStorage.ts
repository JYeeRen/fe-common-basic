import store from "store2";
import { User } from "./types";
import { Option } from "@types";

interface CacheOptions {
  data: Option[];
  params: [];
  time: number;
}

interface LocalValues {
  authToken?: string;
  user?: User;
  "options.roles"?: CacheOptions;
  "options.base"?: CacheOptions;
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
