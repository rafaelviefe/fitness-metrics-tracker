import { StorageService } from '@/core/storage/storage.service';
import { WeightRecord } from '../types';

const WEIGHT_STORAGE_KEY = 'weightRecords';

export class WeightRepository {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Retrieves all weight records from storage.
   * Returns an empty array if no records are found or if data is corrupted.
   */
  getWeightRecords(): WeightRecord[] {
    try {
      const records = this.storageService.getItem<WeightRecord[]>(WEIGHT_STORAGE_KEY);
      // Ensure that if localStorage returns null (e.g., no item) or corrupted data (parsed to non-array),
      // we default to an empty array to prevent app crashes and ensure graceful failure.
      if (!Array.isArray(records)) {
        return [];
      }
      // Basic validation for structure
      return records.filter(record =>
        record && typeof record.id === 'string' &&
        typeof record.date === 'string' &&
        typeof record.weight === 'number'
      );
    } catch (error) {
      console.error('WeightRepository: Error getting weight records, returning empty array.', error);
      return [];
    }
  }

  /**
   * Adds a new weight record to storage.
   * Automatically assigns a unique ID and current timestamp for creation.
   * @param weight The weight value in kilograms.
   * @param date The date string for the record (defaults to current ISO string if not provided).
   * @returns The newly created WeightRecord including its ID.
   */
  addWeightRecord(weight: number, date?: string): WeightRecord {
    const records = this.getWeightRecords();
    const newRecord: WeightRecord = {
      id: crypto.randomUUID(),
      date: date || new Date().toISOString(),
      weight,
    };
    records.push(newRecord);
    this.storageService.setItem(WEIGHT_STORAGE_KEY, records);
    return newRecord;
  }

  /**
   * Updates an existing weight record in storage.
   * @param updatedRecord The record with updated values. Must include a valid ID.
   * @returns The updated WeightRecord if found and updated, otherwise null.
   */
  updateWeightRecord(updatedRecord: WeightRecord): WeightRecord | null {
    let records = this.getWeightRecords();
    const index = records.findIndex(r => r.id === updatedRecord.id);

    if (index > -1) {
      records[index] = { ...records[index], ...updatedRecord }; // Merge to allow partial updates if needed
      this.storageService.setItem(WEIGHT_STORAGE_KEY, records);
      return records[index];
    }
    console.warn(`WeightRepository: Record with ID ${updatedRecord.id} not found for update.`);
    return null;
  }

  /**
   * Deletes a weight record from storage by its ID.
   * @param id The ID of the record to delete.
   * @returns True if the record was found and deleted, false otherwise.
   */
  deleteWeightRecord(id: string): boolean {
    const records = this.getWeightRecords();
    const initialLength = records.length;
    const updatedRecords = records.filter(r => r.id !== id);

    if (updatedRecords.length < initialLength) {
      this.storageService.setItem(WEIGHT_STORAGE_KEY, updatedRecords);
      return true;
    }
    console.warn(`WeightRepository: Record with ID ${id} not found for deletion.`);
    return false;
  }

  /**
   * Clears all weight records from storage.
   */
  clearAllWeightRecords(): void {
    this.storageService.removeItem(WEIGHT_STORAGE_KEY);
  }
}
