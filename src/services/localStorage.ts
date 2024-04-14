import store from 'store2';

interface LocalValues {
  authToken: string;
}

class LocalStorage {
  
  values: Partial<LocalValues> = {};

  setItem<K extends keyof LocalValues>(key: K, value: LocalValues[K]) {
    store.set(key, value);
  }

  getItem<K extends keyof LocalValues>(key: K): LocalValues[K] {
    return store.get(key);
  }
}

export default new LocalStorage;
