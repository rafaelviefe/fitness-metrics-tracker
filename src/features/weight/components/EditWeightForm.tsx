import * as React from 'react';
import { useState } from 'react';
import { WeightRecord } from '../types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatIsoToDateTimeLocal } from '@/lib/date-utils';
import { convertKgToLbs, convertLbsToKg } from '../utils/weight-utils'; // Import conversion utility

interface EditWeightFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  record: WeightRecord;
  onSave: (updatedRecord: WeightRecord) => void;
  onCancel: () => void;
  unitPreference?: 'kg' | 'lbs'; // New prop for unit preference
}

export const EditWeightForm: React.FC<EditWeightFormProps> = ({
  record,
  onSave,
  onCancel,
  className,
  unitPreference = 'kg',
  ...props
}) => {
  const [editedWeight, setEditedWeight] = useState<string>(() => {
    // Initialize editedWeight based on unitPreference
    if (unitPreference === 'lbs') {
      return convertKgToLbs(record.weight).toFixed(1); // Convert from kg to lbs for display
    }
    return record.weight.toString(); // Default to kg
  });
  const [editedDate, setEditedDate] = useState<string>(formatIsoToDateTimeLocal(record.date));
  const [weightError, setWeightError] = useState<string | null>(null); // Separate state for weight error
  const [dateError, setDateError] = useState<string | null>(null);     // Separate state for date error

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedWeight(e.target.value);
    if (weightError) setWeightError(null); // Clear weight error on weight input change
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDate(e.target.value);
    if (dateError) setDateError(null);     // Clear date error on date input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let parsedWeight = parseFloat(editedWeight);
    const parsedDate = new Date(editedDate); 

    let currentWeightError: string | null = null;
    let currentDateError: string | null = null;
    let hasValidationErrors = false;

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      currentWeightError = 'Weight must be a positive number.';
      hasValidationErrors = true;
    }

    if (isNaN(parsedDate.getTime())) {
      currentDateError = 'Invalid date selected.';
      hasValidationErrors = true;
    }

    // Update both error states simultaneously after all validations are checked
    setWeightError(currentWeightError);
    setDateError(currentDateError);

    if (hasValidationErrors) {
      return;
    }

    // Convert weight to kg if unitPreference is 'lbs' for storage
    if (unitPreference === 'lbs') {
      parsedWeight = convertLbsToKg(parsedWeight);
    }

    // If no errors, proceed to save
    const updatedRecord: WeightRecord = {
      ...record,
      weight: parsedWeight,
      date: parsedDate.toISOString(), // Convert the local date-time input back to ISO string for storage (which is UTC)
    };

    onSave(updatedRecord);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
      <div>
        <label htmlFor={`edit-weight-${record.id}`} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Weight ({unitPreference})
        </label>
        <Input
          id={`edit-weight-${record.id}`}
          type="number"
          step="0.1"
          value={editedWeight}
          onChange={handleWeightChange}
          placeholder={`Enter weight in ${unitPreference}`}
          aria-invalid={!!weightError}
          aria-describedby={weightError ? `weight-error-${record.id}` : undefined}
          isError={!!weightError}
        />
        {weightError && <p id={`weight-error-${record.id}`} className="text-red-500 text-sm mt-1">{weightError}</p>}
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
          aria-invalid={!!dateError}
          aria-describedby={dateError ? `date-error-${record.id}` : undefined}
          isError={!!dateError}
        />
        {dateError && <p id={`date-error-${record.id}`} className="text-red-500 text-sm mt-1">{dateError}</p>} {/* Display date error */}
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
