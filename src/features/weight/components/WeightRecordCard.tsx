import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { WeightRecord } from '../types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button'; // Import Button

interface WeightRecordCardProps extends React.HTMLAttributes<HTMLDivElement> {
  record: WeightRecord;
  onDelete?: (id: string) => void;
  onEdit?: (record: WeightRecord) => void;
}

const WeightRecordCard = React.forwardRef<HTMLDivElement, WeightRecordCardProps>(
  ({ record, className, onDelete, onEdit, ...props }, ref) => {
    // Simple date formatting for display, could be enhanced with a date utility
    const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

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
            {record.weight} kg
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
