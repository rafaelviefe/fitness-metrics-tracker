import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalStorageAdapter } from './local-storage.adapter';
import { StorageService } from './storage.service';

describe('LocalStorageAdapter', () => {
  let adapter: StorageService;
  let mockStorage: Record<string, string>; // In-memory object to simulate localStorage
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockStorage = {}; // Reset mock storage before each test

    // Create a mock for the 'Storage' interface to be injected into the adapter
    const localStorageMock: Storage = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
      length: 0, // Not used in this adapter's methods, but part of Storage interface
      key: vi.fn(), // Not used, but part of Storage interface
    };

    // Instantiate the adapter with the mock storage
    adapter = new LocalStorageAdapter(localStorageMock);

    // Spy on console.error to check for error logs
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error to its original implementation after each test
    consoleErrorSpy.mockRestore();
  });

  it('should store and retrieve a string value', () => {
    const key = 'testKey';
    const value = 'testValue';
    adapter.setItem(key, value);
    expect(adapter.getItem<string>(key)).toBe(value);
    expect(vi.mocked(adapter['storage'].setItem)).toHaveBeenCalledWith(key, JSON.stringify(value));
    expect(vi.mocked(adapter['storage'].getItem)).toHaveBeenCalledWith(key);
  });

  it('should store and retrieve an object', () => {
    const key = 'user';
    const user = { name: 'John Doe', age: 30, isActive: true };
    adapter.setItem(key, user);
    expect(adapter.getItem<{ name: string; age: number; isActive: boolean }>(key)).toEqual(user);
    expect(vi.mocked(adapter['storage'].setItem)).toHaveBeenCalledWith(key, JSON.stringify(user));
  });

  it('should store and retrieve a number', () => {
    const key = 'score';
    const score = 123;
    adapter.setItem(key, score);
    expect(adapter.getItem<number>(key)).toBe(score);
  });

  it('should store and retrieve a boolean', () => {
    const key = 'loggedIn';
    const loggedIn = true;
    adapter.setItem(key, loggedIn);
    expect(adapter.getItem<boolean>(key)).toBe(loggedIn);
  });

  it('should return null for a non-existent key', () => {
    expect(adapter.getItem('nonExistentKey')).toBeNull();
    expect(vi.mocked(adapter['storage'].getItem)).toHaveBeenCalledWith('nonExistentKey');
  });

  it('should remove an item', () => {
    const key = 'tempItem';
    adapter.setItem(key, 'value');
    expect(adapter.getItem(key)).toBe('value');
    adapter.removeItem(key);
    expect(adapter.getItem(key)).toBeNull();
    expect(vi.mocked(adapter['storage'].removeItem)).toHaveBeenCalledWith(key);
  });

  it('should clear all items', () => {
    adapter.setItem('key1', 'value1');
    adapter.setItem('key2', 'value2');
    expect(adapter.getItem('key1')).toBe('value1');
    expect(adapter.getItem('key2')).toBe('value2');
    adapter.clear();
    expect(adapter.getItem('key1')).toBeNull();
    expect(adapter.getItem('key2')).toBeNull();
    expect(vi.mocked(adapter['storage'].clear)).toHaveBeenCalled();
  });

  it('should handle malformed JSON gracefully when getting an item', () => {
    const key = 'badJson';
    // Directly set malformed JSON into the mock storage to simulate corruption
    mockStorage[key] = '{ "name": "John" '; // Invalid JSON
    
    expect(adapter.getItem(key)).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error reading or parsing item from localStorage for key "${key}":`,
      expect.any(Error)
    );
  });

  it('should log an error if setItem fails (e.g., QuotaExceededError)', () => {
    const key = 'errorKey';
    const value = { data: 'too big' };
    // Make the mock setItem throw an error
    vi.mocked(adapter['storage'].setItem).mockImplementationOnce(() => {
      throw new Error('QuotaExceededError: The quota has been exceeded.');
    });

    adapter.setItem(key, value);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error writing item to localStorage for key "${key}":`,
      expect.any(Error)
    );
    // Verify that the item was not stored in the mock storage
    expect(mockStorage[key]).toBeUndefined();
  });

  it('should log an error if getItem fails (e.g., security error)', () => {
    const key = 'itemToRead';
    mockStorage[key] = '"someValue"'; // Ensure something is there for getItem to potentially error on
    // Make the mock getItem throw an error
    vi.mocked(adapter['storage'].getItem).mockImplementationOnce(() => {
      throw new Error('SecurityError: Access to localStorage is denied.');
    });

    expect(adapter.getItem(key)).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error reading or parsing item from localStorage for key "${key}":`,
      expect.any(Error)
    );
  });

  it('should log an error if removeItem fails', () => {
    const key = 'itemToRemove';
    mockStorage[key] = '"value"'; // Ensure item exists in mock for potential removal
    // Make the mock removeItem throw an error
    vi.mocked(adapter['storage'].removeItem).mockImplementationOnce(() => {
      throw new Error('OperationNotAllowed: Cannot remove item.');
    });

    adapter.removeItem(key);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error removing item from localStorage for key "${key}":`,
      expect.any(Error)
    );
    // Verify that the item is still in mock storage if the error prevented removal
    expect(mockStorage[key]).toBe('"value"');
  });

  it('should log an error if clear fails', () => {
    adapter.setItem('someKey', 'someValue'); // Put something in mock to clear
    // Make the mock clear throw an error
    vi.mocked(adapter['storage'].clear).mockImplementationOnce(() => {
      throw new Error('ClearFailed: Could not clear all items.');
    });

    adapter.clear();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error clearing localStorage:',
      expect.any(Error)
    );
    // Verify that items are still in mock storage if the error prevented clearing
    expect(adapter.getItem('someKey')).toBe('someValue');
  });
});