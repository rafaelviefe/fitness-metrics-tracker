import { WeightRecord } from '../types';
import { WeightRepository } from '../repositories/weight.repository';

/**
 * Interface to define the aggregated weight statistics for a user.
 */
export interface WeightStatistics {
  latest: WeightRecord | null;
  highest: WeightRecord | null;
  lowest: WeightRecord | null;
  oldest: WeightRecord | null;
  average: number | null;
}

/**
 * Refreshes and returns the aggregated weight statistics using the provided WeightRepository.
 * @param repository An instance of WeightRepository.
 * @returns A WeightStatistics object containing the latest, highest, lowest, oldest, and average weight.
 */
export const refreshWeightStatistics = (repository: WeightRepository): WeightStatistics => {
  const latest = repository.getLatestWeightRecord();
  const highest = repository.getHighestWeightRecord();
  const lowest = repository.getLowestWeightRecord();
  const oldest = repository.getOldestWeightRecord();
  const average = repository.getAverageWeight();

  return {
    latest,
    highest,
    lowest,
    oldest,
    average,
  };
};

/**
 * Converts a weight value from kilograms (kg) to pounds (lbs).
 * 1 kg = 2.20462 lbs.
 * @param kg The weight in kilograms.
 * @returns The weight in pounds.
 */
export const convertKgToLbs = (kg: number): number => {
  const CONVERSION_FACTOR = 2.20462;
  return kg * CONVERSION_FACTOR;
};

/**
 * Converts a weight value from pounds (lbs) to kilograms (kg).
 * 1 lbs = 0.453592 kg.
 * @param lbs The weight in pounds.
 * @returns The weight in kilograms.
 */
export const convertLbsToKg = (lbs: number): number => {
  const CONVERSION_FACTOR = 0.453592;
  return lbs * CONVERSION_FACTOR;
};
