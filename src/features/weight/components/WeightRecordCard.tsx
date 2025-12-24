import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { WeightRecord } from '../types';
import { cn } from '@/lib/utils';

interface WeightRecordCardProps extends React.HTMLAttributes<HTMLDivElement> {
  record: WeightRecord;
}

const WeightRecordCard = React.forwardRef<HTMLDivElement, WeightRecordCardProps>(
  ({ record, className, ...props }, ref) => {
    // Simple date formatting for display, could be enhanced with a date utility
    const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <Card ref={ref} className={cn('flex justify-between items-center', className)} {...props}>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">{formattedDate}</div>
        <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {record.weight} kg
        </div>
      </Card>
    );
  }
);
WeightRecordCard.displayName = 'WeightRecordCard';

export { WeightRecordCard };
