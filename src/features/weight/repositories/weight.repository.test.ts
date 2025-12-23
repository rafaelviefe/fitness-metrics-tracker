import { describe, it, expect, beforeEach, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { WeightRepository } from './weight.repository';
import { StorageService } from '@/core/storage/storage.service';
import { WeightRecord } from '../types';

// Mock for StorageService to control localStorage interactions in tests
class MockStorageService implements StorageService {
  private data: { [key: string]: string } = {}; // Use string to simulate JSON.stringify

  getItem = vi.fn((key: string) => {
    // Simulate JSON.parse if data exists, otherwise return null
    return this.data[key] ? JSON.parse(this.data[key]) : null;
  });
  setItem = vi.fn((key: string, value: any) => {
    this.data[key] = JSON.stringify(value);
  });
  removeItem = vi.fn((key: string) => {
    delete this.data[key];
  });
  clear = vi.fn(() => {
    this.data = {};
  });
}

describe('WeightRepository', () => {
  let storageService: MockStorageService;
  let weightRepository: WeightRepository;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  // Mock crypto.randomUUID to return predictable IDs for tests
  const mockUUIDs = ['id-1', 'id-2', 'id-3', 'id-4'];
  let uuidIndex = 0;
  beforeAll(() => {
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
      const uuid = mockUUIDs[uuidIndex % mockUUIDs.length];
      uuidIndex++;
      return uuid;
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    storageService = new MockStorageService();
    weightRepository = new WeightRepository(storageService);
    // Reset UUID index for each test
    uuidIndex = 0;
    // Spy on console warnings and errors without printing them during tests
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should return an empty array if no weight records exist', () => {
    expect(weightRepository.getWeightRecords()).toEqual([]);
    expect(storageService.getItem).toHaveBeenCalledWith('weightRecords');
  });

  it('should add a new weight record', () => {
    const newRecord = weightRepository.addWeightRecord(75, '2023-01-01T10:00:00.000Z');
    expect(newRecord).toEqual({
      id: 'id-1',
      date: '2023-01-01T10:00:00.000Z',
      weight: 75,
    });
    expect(storageService.setItem).toHaveBeenCalledWith('weightRecords', [newRecord]);
    expect(weightRepository.getWeightRecords()).toEqual([newRecord]);
  });

  it('should add multiple weight records', () => {
    const record1 = weightRepository.addWeightRecord(70, '2023-01-01T10:00:00.000Z');
    const record2 = weightRepository.addWeightRecord(71, '2023-01-02T10:00:00.000Z');
    expect(storageService.setItem).toHaveBeenCalledTimes(2);
    expect(weightRepository.getWeightRecords()).toEqual([record1, record2]);
  });

  it('should update an existing weight record', () => {
    const record1 = weightRepository.addWeightRecord(70, '2023-01-01T10:00:00.000Z');
    const updatedRecord = { ...record1, weight: 70.5 };
    const result = weightRepository.updateWeightRecord(updatedRecord);

    expect(result).toEqual(updatedRecord);
    expect(storageService.setItem).toHaveBeenCalledTimes(2); // one for add, one for update
    expect(storageService.setItem).toHaveBeenCalledWith('weightRecords', [updatedRecord]);
    expect(weightRepository.getWeightRecords()).toEqual([updatedRecord]);
  });

  it('should return null and log a warning if trying to update a non-existent record', () => {
    const nonExistentRecord: WeightRecord = { id: 'non-existent', date: '2023-01-01T10:00:00.000Z', weight: 80 };
    const result = weightRepository.updateWeightRecord(nonExistentRecord);

    expect(result).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `WeightRepository: Record with ID ${nonExistentRecord.id} not found for update.`
    );
    expect(storageService.setItem).not.toHaveBeenCalledWith('weightRecords', expect.any(Array)); // No save operation
  });

  it('should delete an existing weight record', () => {
    const record1 = weightRepository.addWeightRecord(70, '2023-01-01T10:00:00.000Z');
    const record2 = weightRepository.addWeightRecord(71, '2023-01-02T10:00:00.000Z');

    const isDeleted = weightRepository.deleteWeightRecord(record1.id);
    expect(isDeleted).toBe(true);
    expect(storageService.setItem).toHaveBeenCalledTimes(3); // two for adds, one for delete
    expect(storageService.setItem).toHaveBeenCalledWith('weightRecords', [record2]);
    expect(weightRepository.getWeightRecords()).toEqual([record2]);
  });

  it('should return false and log a warning if trying to delete a non-existent record', () => {
    weightRepository.addWeightRecord(70, '2023-01-01T10:00:00.000Z'); // Add one record
    const isDeleted = weightRepository.deleteWeightRecord('non-existent-id');

    expect(isDeleted).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'WeightRepository: Record with ID non-existent-id not found for deletion.'
    );
    expect(storageService.setItem).toHaveBeenCalledTimes(1); // Only for the initial add
  });

  it('should clear all weight records', () => {
    weightRepository.addWeightRecord(70, '2023-01-01T10:00:00.000Z');
    weightRepository.addWeightRecord(71, '2023-01-02T10:00:00.000Z');

    weightRepository.clearAllWeightRecords();
    expect(storageService.removeItem).toHaveBeenCalledWith('weightRecords');
    expect(weightRepository.getWeightRecords()).toEqual([]);
  });

  it('should handle errors from storageService.getItem gracefully by logging an error and returning empty array', () => {
    // Simulate storageService.getItem throwing an error (e.g., due to an underlying storage access issue)
    // This will trigger the try-catch block within WeightRepository.getWeightRecords()
    (storageService.getItem as vi.Mock).mockImplementationOnce(() => {
      throw new Error('Simulated storage access error');
    });

    const records = weightRepository.getWeightRecords();
    expect(records).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'WeightRepository: Error getting weight records, returning empty array.',
      expect.any(Error)
    );
  });

  it('should filter out malformed individual records gracefully', () => {
    const goodRecord: WeightRecord = { id: 'id-good', date: '2023-01-01T10:00:00.000Z', weight: 70 };
    const badRecord = { id: 'id-bad', date: '2023-01-01T10:00:00.000Z' }; // Missing weight
    const malformedRecord = 'not an object'; // Not an object

    // Directly set mock storage data with a mix of good and bad records
    (storageService.getItem as vi.Mock).mockReturnValueOnce([
      goodRecord,
      badRecord,
      malformedRecord
    ]);

    const records = weightRepository.getWeightRecords();
    expect(records).toEqual([goodRecord]); // Only the good record should remain
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // No error should be logged for filtering malformed individual records
  });

  it('should use current ISO string date if not provided when adding a record', () => {
    vi.useFakeTimers();
    const now = new Date('2023-10-27T14:30:00.000Z');
    vi.setSystemTime(now);

    const newRecord = weightRepository.addWeightRecord(80);
    expect(newRecord.date).toBe(now.toISOString());
    expect(newRecord.weight).toBe(80);

    vi.useRealTimers();
  });
});