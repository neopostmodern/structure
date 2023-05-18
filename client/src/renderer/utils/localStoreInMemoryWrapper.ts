type StorageData<T> = {
  [key: string]: T;
};

class LocalStoreInMemoryWrapper<T> {
  private readonly storageKey: string;
  private data: StorageData<T>;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.data = this.loadDataFromStorage();
  }

  private loadDataFromStorage(): StorageData<T> {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveDataToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  getItem(key: string): T | undefined {
    return this.data[key];
  }

  setItem(key: string, value: T) {
    this.data[key] = value;
    this.saveDataToStorage();
  }

  removeItem(key: string) {
    delete this.data[key];
    this.saveDataToStorage();
  }

  clear() {
    this.data = {};
    this.saveDataToStorage();
  }
}

export default LocalStoreInMemoryWrapper;
