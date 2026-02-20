import * as React from 'react';
import { useState } from 'react';
import { WeightRecord } from '../types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface EditWeightFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  record: WeightRecord;
  onSave: (updatedRecord: WeightRecord) => void;
  onCancel: () => void;
}

export const EditWeightForm: React.FC<EditWeightFormProps> = ({ record, onSave, onCancel, className, ...props }) => {
  // Helper to format an ISO date string to "YYYY-MM-DDTHH:mm" for datetime-local input
  const formatIsoToDateTimeLocal = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    // Ensure the date object is valid before formatting
    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided to formatIsoToDateTimeLocal:", isoDateString);
      // Fallback to current local time if date is invalid to prevent input crash
      const now = new Date();
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [editedWeight, setEditedWeight] = useState<string>(record.weight.toString());
  const [editedDate, setEditedDate] = useState<string>(formatIsoToDateTimeLocal(record.date));
  const [error, setError] = useState<string | null>(null);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedWeight(e.target.value);
    if (error) setError(null); // Clear error on input change
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDate(e.target.value);
    if (error) setError(null); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedWeight = parseFloat(editedWeight);
    // Create a Date object from the datetime-local string (parsed as local time)
    const parsedDate = new Date(editedDate);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Weight must be a positive number.');
      return;
    }

    if (isNaN(parsedDate.getTime())) {
      setError('Invalid date selected.');
      return;
    }

    // Convert the local date-time input back to ISO string for storage (which is UTC)
    const updatedRecord: WeightRecord = {
      ...record,
      weight: parsedWeight,
      date: parsedDate.toISOString(),
    };

    onSave(updatedRecord);
    setError(null); // Clear any error on successful save
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
      <div>
        <label htmlFor={`edit-weight-${record.id}`} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Weight (kg)
        </label>
        <Input
          id={`edit-weight-${record.id}`}
          type="number"
          step="0.1"
          value={editedWeight}
          onChange={handleWeightChange}
          placeholder="Enter weight in kg"
          aria-invalid={!!error}
          aria-describedby={error ? `weight-error-${record.id}` : undefined}
        />
        {error && <p id={`weight-error-${record.id}`} className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <label htmlFor={`edit-date-${record.id}`} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Date & Time
        </label>
        <Input
          id={`edit-date-${record.id}`}
          type="datetime-local"
          value={editedDate}
          onChange={handleDateChange}
          aria-invalid={!!error}
          aria-describedby={error ? `date-error-${record.id}` : undefined}
        />
        {/* Error message for date is covered by the general 'error' state */}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};