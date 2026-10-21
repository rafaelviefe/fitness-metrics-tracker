import * as React from 'react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { FormError } from '@/components/ui/FormError';
import { convertKgToLbs, convertLbsToKg } from '../utils/weight-utils';

interface WeightTargetFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  initialTargetWeight: number | null; // Current target weight in KG, or null if not set
  onSave: (targetWeight: number | null) => void; // Callback with target weight in KG or null
  onCancel: () => void;
  unitPreference?: 'kg' | 'lbs';
  formId?: string; // NEW PROP: Optional ID for the form element
}

export const WeightTargetForm: React.FC<WeightTargetFormProps> = ({
  initialTargetWeight,
  onSave,
  onCancel,
  className,
  unitPreference = 'kg',
  formId,
  ...props
}) => {
  const [editedTargetWeight, setEditedTargetWeight] = useState<string>(() => {
    if (initialTargetWeight === null) return '';
    if (unitPreference === 'lbs') {
      return convertKgToLbs(initialTargetWeight).toFixed(1);
    }
    return initialTargetWeight.toFixed(1);
  });
  const [weightError, setWeightError] = useState<string | null>(null);

  // Update internal state if initialTargetWeight or unitPreference changes externally
  useEffect(() => {
    if (initialTargetWeight === null) {
      setEditedTargetWeight('');
    } else if (unitPreference === 'lbs') {
      setEditedTargetWeight(convertKgToLbs(initialTargetWeight).toFixed(1));
    } else {
      setEditedTargetWeight(initialTargetWeight.toFixed(1));
    }
    // Clear any previous error when initial data changes
    setWeightError(null);
  }, [initialTargetWeight, unitPreference]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTargetWeight(e.target.value);
    if (weightError) setWeightError(null); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If input is empty, it means the user wants to clear the target weight
    if (editedTargetWeight.trim() === '') {
      onSave(null);
      return;
    }

    let parsedWeight = parseFloat(editedTargetWeight);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setWeightError('Target weight must be a positive number.');
      return;
    }

    // Convert to kg if preference is lbs before saving
    let weightInKg = parsedWeight;
    if (unitPreference === 'lbs') {
      weightInKg = convertLbsToKg(parsedWeight);
    }

    setWeightError(null); // Clear any lingering error
    onSave(weightInKg);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} id={formId} {...props}>
      <div>
        <label htmlFor="target-weight-input" className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Target Weight ({unitPreference})
        </label>
        <Input
          id="target-weight-input"
          placeholder={`Enter target weight in ${unitPreference}`}
          type="number"
          step="0.1"
          value={editedTargetWeight}
          onChange={handleWeightChange}
          aria-invalid={!!weightError}
          aria-describedby={weightError ? 'target-weight-error' : undefined}
          isError={!!weightError}
        />
        <FormError id="target-weight-error">{weightError}</FormError>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Target
        </Button>
      </div>
    </form>
  );
};