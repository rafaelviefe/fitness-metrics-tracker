export interface StorageService {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): boolean;
  removeItem(key: string): void;
  clear(): void;
}
