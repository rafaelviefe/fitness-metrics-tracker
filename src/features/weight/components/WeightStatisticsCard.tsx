import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { formatDateForDisplay, formatDateWithTimeForDisplay } from '@/lib/date-utils';
import { WeightRecord } from '../types';
import { convertKgToLbs } from '../utils/weight-utils'; // Import conversion utility

interface WeightStatisticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  record?: WeightRecord | null;
  label: string;
  displayTime?: boolean; // New prop for conditional time display
  unitPreference?: 'kg' | 'lbs'; // New prop for unit preference
  averageValue?: number | null; // NEW PROP
}

const WeightStatisticsCard = React.forwardRef<HTMLDivElement, WeightStatisticsCardProps>(
  ({ record, label, className, displayTime = false, unitPreference = 'kg', averageValue = null, ...props }, ref) => {
    let content;
    let displayedWeight: string | number | null = null;
    let displayedUnit = unitPreference;

    if (averageValue !== null) {
      // Prioritize averageValue if provided
      displayedWeight = unitPreference === 'lbs'
        ? convertKgToLbs(averageValue).toFixed(1)
        : averageValue.toFixed(1); // Format to one decimal place for kg as well
      
      content = (
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{displayedWeight} {displayedUnit}</p>
          {/* No date is shown for averageValue */}
        </div>
      );
    } else if (record) {
      // Fallback to record if averageValue is null
      const shouldDisplayDateForRecord = record.id !== 'average'; // Existing logic for records
      
      displayedWeight = unitPreference === 'lbs'
        ? convertKgToLbs(record.weight).toFixed(1) // Format to one decimal place for lbs
        : record.weight.toFixed(1); // Format to one decimal place for kg as well

      const formattedDate = shouldDisplayDateForRecord
        ? (displayTime ? formatDateWithTimeForDisplay(record.date) : formatDateForDisplay(record.date))
        : null;

      content = (
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{displayedWeight} {displayedUnit}</p>
          {shouldDisplayDateForRecord && formattedDate && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{formattedDate}</p>
          )}
        </div>
      );
    } else {
      // No record and no averageValue
      content = (
        <p className="text-neutral-500 dark:text-neutral-400">No records yet.</p>
      );
    }

    return (
      <Card ref={ref} className={cn('flex flex-col', className)} {...props}>
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-2">{label}</h3>
        {content}
      </Card>
    );
  }
);

WeightStatisticsCard.displayName = 'WeightStatisticsCard';

export { WeightStatisticsCard };
