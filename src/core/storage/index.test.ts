import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from './index';

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

describe('StorageService', () => {
  let service: StorageService;
  let mockStorageInstance: typeof mockLocalStorage;

  beforeEach(() => {
    // Reset the mock storage and all spies before each test
    mockLocalStorage.clear(); // Clears the internal store
    vi.clearAllMocks(); // Resets mock function call counts
    mockStorageInstance = mockLocalStorage; // Assign the mock to a local variable for type inference
    service = new StorageService(mockStorageInstance as unknown as Storage); // Cast to Storage interface
  });

  describe('set', () => {
    it('should store a string value correctly', () => {
      const key = 'testKey';
      const value = 'testValue';
      service.set(key, value);
      expect(mockStorageInstance.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
      expect(mockStorageInstance.getItem(key)).toBe(JSON.stringify(value));
    });

    it('should store an object value correctly', () => {
      const key = 'user';
      const value = { id: 1, name: 'Alice' };
      service.set(key, value);
      expect(mockStorageInstance.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
      expect(mockStorageInstance.getItem(key)).toBe(JSON.stringify(value));
    });

    it('should handle errors when localStorage.setItem fails (e.g., QuotaExceededError)', () => {
      const key = 'errorKey';
      const value = 'errorValue';
      vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in test
      mockStorageInstance.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      service.set(key, value);
      expect(console.error).toHaveBeenCalledWith(
        `StorageService: Error setting item for key "${key}":`,
        expect.any(Error)
      );
      expect(mockStorageInstance.getItem(key)).toBeNull(); // Should not have been set
    });
  });

  describe('get', () => {
    it('should retrieve a string value correctly', () => {
      const key = 'testKey';
      const value = 'testValue';
      mockStorageInstance.setItem(key, JSON.stringify(value)); // Manually set mock storage
      const retrieved = service.get<string>(key);
      expect(mockStorageInstance.getItem).toHaveBeenCalledWith(key);
      expect(retrieved).toBe(value);
    });

    it('should retrieve an object value correctly', () => {
      const key = 'user';
      const value = { id: 1, name: 'Alice' };
      mockStorageInstance.setItem(key, JSON.stringify(value));
      const retrieved = service.get<{ id: number; name: string }>(key);
      expect(mockStorageInstance.getItem).toHaveBeenCalledWith(key);
      expect(retrieved).toEqual(value);
    });

    it('should return null if the key does not exist', () => {
      const key = 'nonExistentKey';
      const retrieved = service.get<string>(key);
      expect(mockStorageInstance.getItem).toHaveBeenCalledWith(key);
      expect(retrieved).toBeNull();
    });

    it('should return null and log error if stored value is not valid JSON', () => {
      const key = 'invalidJson';
      mockStorageInstance.setItem(key, 'this is not valid json');
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const retrieved = service.get<any>(key);
      expect(mockStorageInstance.getItem).toHaveBeenCalledWith(key);
      expect(retrieved).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        `StorageService: Error getting or parsing item for key "${key}":`,
        expect.any(SyntaxError)
      );
    });

    it('should return null and log error if localStorage.getItem fails', () => {
      const key = 'errorKey';
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockStorageInstance.getItem.mockImplementationOnce(() => {
        throw new Error('Read error');
      });

      const retrieved = service.get<string>(key);
      expect(console.error).toHaveBeenCalledWith(
        `StorageService: Error getting or parsing item for key "${key}":`,
        expect.any(Error)
      );
      expect(retrieved).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove an item correctly', () => {
      const key = 'itemToRemove';
      mockStorageInstance.setItem(key, 'value'); // Ensure it exists
      expect(mockStorageInstance.getItem(key)).not.toBeNull();

      service.remove(key);
      expect(mockStorageInstance.removeItem).toHaveBeenCalledWith(key);
      expect(mockStorageInstance.getItem(key)).toBeNull();
    });

    it('should handle errors when localStorage.removeItem fails', () => {
      const key = 'errorKey';
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockStorageInstance.removeItem.mockImplementationOnce(() => {
        throw new Error('Remove error');
      });

      service.remove(key);
      expect(console.error).toHaveBeenCalledWith(
        `StorageService: Error removing item for key "${key}":`,
        expect.any(Error)
      );
    });
  });

  describe('clear', () => {
    it('should clear all items correctly', () => {
      mockStorageInstance.setItem('key1', 'value1');
      mockStorageInstance.setItem('key2', 'value2');
      expect(mockStorageInstance.length).toBe(2);

      service.clear();
      expect(mockStorageInstance.clear).toHaveBeenCalledTimes(1);
      expect(mockStorageInstance.length).toBe(0);
      expect(mockStorageInstance.getItem('key1')).toBeNull();
    });

    it('should handle errors when localStorage.clear fails', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockStorageInstance.clear.mockImplementationOnce(() => {
        throw new Error('Clear error');
      });

      service.clear();
      expect(console.error).toHaveBeenCalledWith(
        `StorageService: Error clearing storage:`,
        expect.any(Error)
      );
    });
  });

  describe('localStorageService singleton', () => {
    const originalLocalStorage = window.localStorage;
    let mockStorage: typeof mockLocalStorage;
    let localStorageServiceInstance: StorageService;
    let DynamicallyImportedStorageService: typeof StorageService; // Declare the dynamically imported class

    beforeEach(async () => {
      // 1. Reset the module cache to ensure a fresh import
      vi.resetModules();

      // Reset the mock storage and all spies before each test
      mockLocalStorage.clear();
      vi.clearAllMocks();
      mockStorage = mockLocalStorage;

      // 2. Replace window.localStorage with our mock
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true,
        configurable: true,
      });

      // 3. Dynamically import the module *after* localStorage is mocked
      // This ensures the singleton uses the mocked localStorage
      const module = await import('./index');
      localStorageServiceInstance = module.localStorageService;
      DynamicallyImportedStorageService = module.StorageService; // Capture the class from the dynamic import
    });

    afterEach(() => {
      // Restore original localStorage after each test in this block
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true,
      });
    });

    it('should be an instance of StorageService', () => {
      // Use the dynamically imported StorageService class for the instance check
      expect(localStorageServiceInstance).toBeInstanceOf(DynamicallyImportedStorageService);
    });

    it('should delegate set calls to window.localStorage', () => {
      const key = 'singletonKey';
      const value = { data: 'singletonValue' };
      localStorageServiceInstance.set(key, value);
      expect(mockStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should delegate get calls to window.localStorage', () => {
      const key = 'singletonKey';
      const value = { data: 'singletonValue' };
      mockStorage.setItem(key, JSON.stringify(value));
      const retrieved = localStorageServiceInstance.get(key);
      expect(mockStorage.getItem).toHaveBeenCalledWith(key);
      expect(retrieved).toEqual(value);
    });

    it('should return null if key is not found via singleton', () => {
      const retrieved = localStorageServiceInstance.get('nonExistentKey');
      expect(retrieved).toBeNull();
    });

    it('should delegate remove calls to window.localStorage', () => {
      const key = 'singletonRemoveKey';
      mockStorage.setItem(key, 'someValue');
      localStorageServiceInstance.remove(key);
      expect(mockStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should delegate clear calls to window.localStorage', () => {
      mockStorage.setItem('k1', 'v1');
      localStorageServiceInstance.clear();
      expect(mockStorage.clear).toHaveBeenCalledTimes(1);
    });
  });
});