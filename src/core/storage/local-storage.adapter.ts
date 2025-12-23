import { StorageService } from './storage.service';

export class LocalStorageAdapter implements StorageService {
  // Default to window.localStorage, but allow injection for testing
  constructor(private readonly storage: Storage = window.localStorage) {}

  getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return null;
      }
      // Attempt to parse the stored string as JSON
      return JSON.parse(item) as T;
    } catch (error) {
      // Log the error but return null to fail gracefully if parsing or reading fails
      console.error(`Error reading or parsing item from localStorage for key "${key}":`, error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      // Stringify the value before storing it
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Log the error if writing fails (e.g., QuotaExceededError)
      console.error(`Error writing item to localStorage for key "${key}":`, error);
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      // Log the error if removal fails
      console.error(`Error removing item from localStorage for key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      // Log the error if clearing fails
      console.error('Error clearing localStorage:', error);
    }
  }
}