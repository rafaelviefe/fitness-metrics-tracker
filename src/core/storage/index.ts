class StorageService {
  private storage: Storage;

  constructor(storageInstance: Storage) {
    this.storage = storageInstance;
  }

  /**
   * Stores a value in storage with the given key. The value is automatically JSON-serialized.
   * @param key The key under which to store the value.
   * @param value The value to store.
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`StorageService: Error setting item for key "${key}":`, error);
    }
  }

  /**
   * Retrieves a value from storage with the given key. The value is automatically JSON-parsed.
   * @param key The key of the value to retrieve.
   * @returns The retrieved value, or null if the key does not exist or an error occurs during parsing.
   */
  get<T>(key: string): T | null {
    try {
      const serializedValue = this.storage.getItem(key);
      if (serializedValue === null) {
        return null; // Key not found
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`StorageService: Error getting or parsing item for key "${key}":`, error);
      return null; // Indicate failure to retrieve/parse
    }
  }

  /**
   * Removes an item from storage with the given key.
   * @param key The key of the item to remove.
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`StorageService: Error removing item for key "${key}":`, error);
    }
  }

  /**
   * Clears all items from storage.
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error("StorageService: Error clearing storage:", error);
    }
  }
}

// A dummy storage implementation for SSR or environments without localStorage
const dummyStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: (index: number) => null,
  removeItem: () => {},
  setItem: () => {},
};

/**
 * Singleton instance of StorageService pre-configured to use window.localStorage.
 * Guards against SSR environments by using a dummy storage if window is undefined.
 * Consumers should use this instance directly for localStorage interactions.
 */
export const localStorageService = new StorageService(
  typeof window !== 'undefined' ? window.localStorage : dummyStorage
);

export { StorageService };