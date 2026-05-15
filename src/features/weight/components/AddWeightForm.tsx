import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatIsoToDateTimeLocal } from '@/lib/date-utils'; // Import date utility

interface AddWeightFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onWeightAdded?: (weight: number, date: string) => void; // Updated prop type
}

export const AddWeightForm: React.FC<AddWeightFormProps> = ({
  className,
  onWeightAdded,
  ...props
}) => {
  const [weight, setWeight] = useState<string>('');
  const [weightError, setWeightError] = useState<string | null>(null); // Renamed error state
  // Initialize date with current local time formatted for datetime-local input
  const [addedDate, setAddedDate] = useState<string>(formatIsoToDateTimeLocal(new Date().toISOString()));
  const [dateError, setDateError] = useState<string | null>(null); // New state for date error

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (weightError) {
      setWeightError(null); // Clear weight error when user starts typing again
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddedDate(e.target.value);
    if (dateError) {
      setDateError(null); // Clear date error on date input change
    }
  };

  // Prevent default form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedWeight = parseFloat(weight);
    const parsedDate = new Date(addedDate);

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

    // Clear the weight input field immediately after successful validation.
    setWeight('');
    // Reset date input to current local time after successful submission
    setAddedDate(formatIsoToDateTimeLocal(new Date().toISOString()));

    if (onWeightAdded) {
      // Convert the local date-time input back to ISO string for storage (which is UTC)
      onWeightAdded(parsedWeight, parsedDate.toISOString());
    }
  };

  // Button should be disabled if weight is empty, or if there's any validation error
  const isSubmitDisabled = !weight || !!weightError || !!dateError;

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
      <div>
        <label htmlFor="weight-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Weight (kg)
        </label>
        <Input
          id="weight-input"
          placeholder="Enter weight in kg"
          type="number"
          step="0.1"
          value={weight}
          onChange={handleWeightChange}
          aria-invalid={!!weightError}
          aria-describedby={weightError ? 'weight-error' : undefined}
          isError={!!weightError}
        />
        {weightError && <p id="weight-error" className="text-red-500 text-sm mt-1">{weightError}</p>}
      </div>

      <div>
        <label htmlFor="date-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Date & Time
        </label>
        <Input
          id="date-input"
          type="datetime-local"
          value={addedDate}
          onChange={handleDateChange}
          aria-invalid={!!dateError}
          aria-describedby={dateError ? 'date-error' : undefined}
          isError={!!dateError}
        />
        {dateError && <p id="date-error" className="text-red-500 text-sm mt-1">{dateError}</p>}
      </div>

      <Button type="submit" disabled={isSubmitDisabled} className="mt-4">
        Add Weight
      </Button>
    </form>
  );
};