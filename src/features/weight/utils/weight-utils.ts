import { WeightRecord } from '../types';

/**
 * Interface to define the aggregated weight statistics for a user.
 */
export interface WeightStatistics {
  latest: WeightRecord | null;
  highest: WeightRecord | null;
  lowest: WeightRecord | null;
  oldest: WeightRecord | null;
}
