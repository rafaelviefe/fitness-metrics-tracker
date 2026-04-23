import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refreshWeightStatistics } from './weight-utils';
import { WeightRepository } from '../repositories/weight.repository';
import { WeightRecord } from '../types';

// Mock WeightRepository for testing the utility function
const mockWeightRepository = {
  getLatestWeightRecord: vi.fn(),
  getHighestWeightRecord: vi.fn(),
  getLowestWeightRecord: vi.fn(),
  getOldestWeightRecord: vi.fn(),
  // Include other methods from WeightRepository to satisfy TypeScript, even if not called by this utility
  getWeightRecords: vi.fn(),
  addWeightRecord: vi.fn(),
  updateWeightRecord: vi.fn(),
  deleteWeightRecord: vi.fn(),
  clearAllWeightRecords: vi.fn(),
} as unknown as WeightRepository; // Cast to WeightRepository

describe('refreshWeightStatistics', () => {
  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call all necessary repository methods and return a populated WeightStatistics object', () => {
    const mockLatest: WeightRecord = { id: 'l1', date: '2023-10-30T10:00:00.000Z', weight: 80 };
    const mockHighest: WeightRecord = { id: 'h1', date: '2023-09-01T10:00:00.000Z', weight: 90 };
    const mockLowest: WeightRecord = { id: 'lo1', date: '2023-08-15T10:00:00.000Z', weight: 70 };
    const mockOldest: WeightRecord = { id: 'o1', date: '2023-07-01T10:00:00.000Z', weight: 75 };

    mockWeightRepository.getLatestWeightRecord.mockReturnValue(mockLatest);
    mockWeightRepository.getHighestWeightRecord.mockReturnValue(mockHighest);
    mockWeightRepository.getLowestWeightRecord.mockReturnValue(mockLowest);
    mockWeightRepository.getOldestWeightRecord.mockReturnValue(mockOldest);

    const result = refreshWeightStatistics(mockWeightRepository);

    expect(mockWeightRepository.getLatestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getHighestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getLowestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getOldestWeightRecord).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      latest: mockLatest,
      highest: mockHighest,
      lowest: mockLowest,
      oldest: mockOldest,
    });
  });

  it('should handle cases where some or all records are null (e.g., no records in repository)', () => {
    mockWeightRepository.getLatestWeightRecord.mockReturnValue(null);
    mockWeightRepository.getHighestWeightRecord.mockReturnValue(null);
    mockWeightRepository.getLowestWeightRecord.mockReturnValue(null);
    mockWeightRepository.getOldestWeightRecord.mockReturnValue(null);

    const result = refreshWeightStatistics(mockWeightRepository);

    expect(mockWeightRepository.getLatestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getHighestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getLowestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getOldestWeightRecord).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      latest: null,
      highest: null,
      lowest: null,
      oldest: null,
    });
  });

  it('should correctly combine a mix of existing and null records', () => {
    const mockLatest: WeightRecord = { id: 'l1', date: '2023-10-30T10:00:00.000Z', weight: 80 };
    const mockLowest: WeightRecord = { id: 'lo1', date: '2023-08-15T10:00:00.000Z', weight: 70 };

    mockWeightRepository.getLatestWeightRecord.mockReturnValue(mockLatest);
    mockWeightRepository.getHighestWeightRecord.mockReturnValue(null); // No highest
    mockWeightRepository.getLowestWeightRecord.mockReturnValue(mockLowest);
    mockWeightRepository.getOldestWeightRecord.mockReturnValue(null); // No oldest

    const result = refreshWeightStatistics(mockWeightRepository);

    expect(result).toEqual({
      latest: mockLatest,
      highest: null,
      lowest: mockLowest,
      oldest: null,
    });
  });
});