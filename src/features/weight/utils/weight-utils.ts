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
}

/**
 * Refreshes and returns the aggregated weight statistics using the provided WeightRepository.
 * @param repository An instance of WeightRepository.
 * @returns A WeightStatistics object containing the latest, highest, lowest, and oldest weight records.
 */
export const refreshWeightStatistics = (repository: WeightRepository): WeightStatistics => {
  const latest = repository.getLatestWeightRecord();
  const highest = repository.getHighestWeightRecord();
  const lowest = repository.getLowestWeightRecord();
  const oldest = repository.getOldestWeightRecord();

  return {
    latest,
    highest,
    lowest,
    oldest,
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
