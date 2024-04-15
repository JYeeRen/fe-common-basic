import store from 'store2';
import { User } from './types';

interface LocalValues {
  authToken: string;
  user: User;
}

class LocalStorage {
  
  values: Partial<LocalValues> = {};

  constructor() {
    this.values.user = { name: 'admin' };
  }

  setItem<K extends keyof LocalValues>(key: K, value: LocalValues[K]) {
    store.set(key, value);
  }

  getItem<K extends keyof LocalValues>(key: K): LocalValues[K] {
    return store.get(key);
  }
}

export default new LocalStorage;
