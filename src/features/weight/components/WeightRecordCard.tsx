import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { WeightRecord } from '../types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button'; // Import Button
import { formatDateForDisplay, formatDateWithTimeForDisplay } from '@/lib/date-utils'; // Import date formatters
import { convertKgToLbs } from '../utils/weight-utils'; // Import conversion utility

interface WeightRecordCardProps extends React.HTMLAttributes<HTMLDivElement> {
  record: WeightRecord;
  onDelete?: (id: string) => void;
  onEdit?: (record: WeightRecord) => void;
  unitPreference?: 'kg' | 'lbs'; // New prop for unit preference
  displayTime?: boolean; // New prop for conditional time display
}

const WeightRecordCard = React.forwardRef<HTMLDivElement, WeightRecordCardProps>(
  ({ record, className, onDelete, onEdit, unitPreference = 'kg', displayTime = false, ...props }, ref) => {
    // Use the utility function for date formatting, conditionally including time
    const formattedDate = displayTime
      ? formatDateWithTimeForDisplay(record.date)
      : formatDateForDisplay(record.date);

    // Convert and format weight based on unitPreference
    const displayedWeight = unitPreference === 'lbs'
      ? convertKgToLbs(record.weight).toFixed(1) // Format to one decimal place for lbs
      : record.weight.toFixed(1); // Format to one decimal place for kg as well
    const displayedUnit = unitPreference;

    const handleDeleteClick = () => {
      onDelete?.(record.id);
    };

    const handleEditClick = () => {
      onEdit?.(record);
    };

    return (
      <Card ref={ref} className={cn('flex justify-between items-center', className)} {...props}>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">{formattedDate}</div>
        <div className="flex items-center space-x-2">
          <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            {displayedWeight} {displayedUnit}
          </div>
          <Button variant="secondary" size="sm" onClick={handleEditClick}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteClick}>Delete</Button>
        </div>
      </Card>
    );
  }
);
WeightRecordCard.displayName = 'WeightRecordCard';

export { WeightRecordCard };
