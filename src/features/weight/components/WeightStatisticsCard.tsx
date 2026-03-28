import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { formatDateForDisplay } from '@/lib/date-utils';
import { WeightRecord } from '../types';

interface WeightStatisticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  record?: WeightRecord | null; // Allow null for the record prop
  label: string; // Label for the statistic (e.g., "Latest Weight")
}

const WeightStatisticsCard = React.forwardRef<HTMLDivElement, WeightStatisticsCardProps>(
  ({ record, label, className, ...props }, ref) => {
    const content = record ? (
      <div className="flex items-baseline space-x-2">
        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{record.weight} kg</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDateForDisplay(record.date)}</p>
      </div>
    ) : (
      <p className="text-neutral-500 dark:text-neutral-400">No records yet.</p>
    );

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
