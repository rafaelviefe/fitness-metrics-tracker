import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatIsoToDateTimeLocal } from '@/lib/date-utils'; // Import date utility
import { convertLbsToKg } from '../utils/weight-utils'; // Import conversion utility
import { FormError } from '@/components/ui/FormError'; // Import FormError

interface AddWeightFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onWeightAdded?: (weight: number, date: string) => void;
  unitPreference?: 'kg' | 'lbs'; // New prop for unit preference
  submissionError?: string | null; // NEW PROP: Optional prop for displaying a general submission error
}

export const AddWeightForm: React.FC<AddWeightFormProps> = ({
  className,
  onWeightAdded,
  unitPreference = 'kg',
  submissionError = null, // Default to null if not provided
  ...props
}) => {
  const [weight, setWeight] = useState<string>('');
  const [weightError, setWeightError] = useState<string | null>(null);
  const [addedDate, setAddedDate] = useState<string>(formatIsoToDateTimeLocal(new Date().toISOString()));
  const [dateError, setDateError] = useState<string | null>(null);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (weightError) {
      setWeightError(null);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddedDate(e.target.value);
    if (dateError) {
      setDateError(null);
    }
  };

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

    setWeightError(currentWeightError);
    setDateError(currentDateError);

    if (hasValidationErrors) {
      return;
    }

    // Convert weight to kg if unitPreference is 'lbs'
    let weightInKg = parsedWeight;
    if (unitPreference === 'lbs') {
      weightInKg = convertLbsToKg(parsedWeight);
    }

    setWeight('');
    setAddedDate(formatIsoToDateTimeLocal(new Date().toISOString()));

    if (onWeightAdded) {
      onWeightAdded(weightInKg, parsedDate.toISOString());
    }
  };

  const isSubmitDisabled = !weight || !!weightError || !!dateError;

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
      <div>
        <label htmlFor="weight-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Weight ({unitPreference})
        </label>
        <Input
          id="weight-input"
          placeholder={`Enter weight in ${unitPreference}`}
          type="number"
          step="0.1"
          value={weight}
          onChange={handleWeightChange}
          aria-invalid={!!weightError}
          aria-describedby={weightError ? 'weight-error' : undefined}
          isError={!!weightError}
        />
        <FormError id="weight-error">{weightError}</FormError>
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
        <FormError id="date-error">{dateError}</FormError>
      </div>

      {submissionError && <p className="text-red-500 text-sm mt-1" role="alert">{submissionError}</p>}

      <Button type="submit" disabled={isSubmitDisabled} className="mt-4">
        Add Weight
      </Button>
    </form>
  );
};
