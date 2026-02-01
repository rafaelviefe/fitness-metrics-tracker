import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddWeightFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onWeightAdded?: (weight: number) => void;
}

export const AddWeightForm: React.FC<AddWeightFormProps> = ({ className, onWeightAdded, ...props }) => {
  const [weight, setWeight] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (error) {
      setError(null); // Clear error when user starts typing again
    }
  };

  // Prevent default form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedWeight = parseFloat(weight);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Weight must be a positive number.');
      return; 
    }

    setError(null); // Clear any previous error
    
    if (onWeightAdded) {
      onWeightAdded(parsedWeight);
    }
    
    setWeight(''); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} className={className} {...props}>
      <Input
        placeholder="Enter weight in kg"
        type="number"
        step="0.1"
        value={weight}
        onChange={handleWeightChange}
        className="mb-2"
        aria-invalid={!!error}
        aria-describedby={error ? 'weight-error' : undefined}
      />
      {error && <p id="weight-error" className="text-red-500 text-sm mb-2">{error}</p>}
      <Button type="submit">Add Weight</Button>
    </form>
  );
};
