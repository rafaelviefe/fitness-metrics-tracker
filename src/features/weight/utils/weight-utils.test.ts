import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refreshWeightStatistics, convertKgToLbs, convertLbsToKg } from './weight-utils';
import { WeightRepository } from '../repositories/weight.repository';
import { WeightRecord } from '../types';

// Mock WeightRepository for testing the utility function
const mockWeightRepository = {
  getLatestWeightRecord: vi.fn(),
  getHighestWeightRecord: vi.fn(),
  getLowestWeightRecord: vi.fn(),
  getOldestWeightRecord: vi.fn(),
  getAverageWeight: vi.fn(), // Mock the new method
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
    const mockAverage = 78.3; // Mock average value

    mockWeightRepository.getLatestWeightRecord.mockReturnValue(mockLatest);
    mockWeightRepository.getHighestWeightRecord.mockReturnValue(mockHighest);
    mockWeightRepository.getLowestWeightRecord.mockReturnValue(mockLowest);
    mockWeightRepository.getOldestWeightRecord.mockReturnValue(mockOldest);
    mockWeightRepository.getAverageWeight.mockReturnValue(mockAverage); // Mock average

    const result = refreshWeightStatistics(mockWeightRepository);

    expect(mockWeightRepository.getLatestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getHighestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getLowestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getOldestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getAverageWeight).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      latest: mockLatest,
      highest: mockHighest,
      lowest: mockLowest,
      oldest: mockOldest,
      average: mockAverage, // Assert average
    });
  });

  it('should handle cases where some or all records are null (e.g., no records in repository)', () => {
    mockWeightRepository.getLatestWeightRecord.mockReturnValue(null);
    mockWeightRepository.getHighestWeightRecord.mockReturnValue(null);
    mockWeightRepository.getLowestWeightRecord.mockReturnValue(null);
    mockWeightRepository.getOldestWeightRecord.mockReturnValue(null);
    mockWeightRepository.getAverageWeight.mockReturnValue(null); // Mock average as null

    const result = refreshWeightStatistics(mockWeightRepository);

    expect(mockWeightRepository.getLatestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getHighestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getLowestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getOldestWeightRecord).toHaveBeenCalledTimes(1);
    expect(mockWeightRepository.getAverageWeight).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      latest: null,
      highest: null,
      lowest: null,
      oldest: null,
      average: null, // Assert average is null
    });
  });

  it('should correctly combine a mix of existing and null records', () => {
    const mockLatest: WeightRecord = { id: 'l1', date: '2023-10-30T10:00:00.000Z', weight: 80 };
    const mockLowest: WeightRecord = { id: 'lo1', date: '2023-08-15T10:00:00.000Z', weight: 70 };
    const mockAverage = 75.5; // Mock average value

    mockWeightRepository.getLatestWeightRecord.mockReturnValue(mockLatest);
    mockWeightRepository.getHighestWeightRecord.mockReturnValue(null); // No highest
    mockWeightRepository.getLowestWeightRecord.mockReturnValue(mockLowest);
    mockWeightRepository.getOldestWeightRecord.mockReturnValue(null); // No oldest
    mockWeightRepository.getAverageWeight.mockReturnValue(mockAverage); // Mock average

    const result = refreshWeightStatistics(mockWeightRepository);

    expect(result).toEqual({
      latest: mockLatest,
      highest: null,
      lowest: mockLowest,
      oldest: null,
      average: mockAverage, // Assert average
    });
  });
});

describe('convertKgToLbs', () => {
  it('should convert kilograms to pounds correctly for a positive integer', () => {
    const kg = 10;
    const expectedLbs = 10 * 2.20462;
    expect(convertKgToLbs(kg)).toBeCloseTo(expectedLbs);
  });

  it('should convert kilograms to pounds correctly for a decimal number', () => {
    const kg = 75.5;
    const expectedLbs = 75.5 * 2.20462;
    expect(convertKgToLbs(kg)).toBeCloseTo(expectedLbs);
  });

  it('should return 0 when converting 0 kg', () => {
    const kg = 0;
    const expectedLbs = 0 * 2.20462;
    expect(convertKgToLbs(kg)).toBeCloseTo(expectedLbs);
  });

  it('should convert a small positive number correctly', () => {
    const kg = 0.5;
    const expectedLbs = 0.5 * 2.20462;
    expect(convertKgToLbs(kg)).toBeCloseTo(expectedLbs);
  });

  it('should convert a large number correctly', () => {
    const kg = 1000;
    const expectedLbs = 1000 * 2.20462;
    expect(convertKgToLbs(kg)).toBeCloseTo(expectedLbs);
  });

  it('should handle negative numbers (though weight is typically positive, function should behave predictably)', () => {
    const kg = -5;
    const expectedLbs = -5 * 2.20462;
    expect(convertKgToLbs(kg)).toBeCloseTo(expectedLbs);
  });

  it('should correctly convert another sample weight from kg to lbs', () => {
    const kg = 68.3;
    const expectedLbs = 68.3 * 2.20462;
    expect(convertKgToLbs(kg)).toBeCloseTo(expectedLbs);
  });
});

describe('convertLbsToKg', () => {
  it('should convert pounds to kilograms correctly for a positive integer', () => {
    const lbs = 20;
    const expectedKg = 20 * 0.453592;
    expect(convertLbsToKg(lbs)).toBeCloseTo(expectedKg);
  });

  it('should convert pounds to kilograms correctly for a decimal number', () => {
    const lbs = 150.8;
    const expectedKg = 150.8 * 0.453592;
    expect(convertLbsToKg(lbs)).toBeCloseTo(expectedKg);
  });

  it('should return 0 when converting 0 lbs', () => {
    const lbs = 0;
    const expectedKg = 0 * 0.453592;
    expect(convertLbsToKg(lbs)).toBeCloseTo(expectedKg);
  });

  it('should convert a small positive number correctly', () => {
    const lbs = 1.1;
    const expectedKg = 1.1 * 0.453592;
    expect(convertLbsToKg(lbs)).toBeCloseTo(expectedKg);
  });

  it('should convert a large number correctly', () => {
    const lbs = 2200;
    const expectedKg = 2200 * 0.453592;
    expect(convertLbsToKg(lbs)).toBeCloseTo(expectedKg);
  });

  it('should handle negative numbers (though weight is typically positive, function should behave predictably)', () => {
    const lbs = -10;
    const expectedKg = -10 * 0.453592;
    expect(convertLbsToKg(lbs)).toBeCloseTo(expectedKg);
  });

  it('should correctly convert another sample weight from lbs to kg', () => {
    const lbs = 175.0;
    const expectedKg = 175.0 * 0.453592;
    expect(convertLbsToKg(lbs)).toBeCloseTo(expectedKg);
  });
});
